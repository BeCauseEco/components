import {
  Editor,
  unwrapNodes,
  wrapNodes,
  setNodes,
  BaseEditor,
  Element,
  Text,
  Descendant,
  Transforms,
  Node,
  Path,
} from "slate"
import { LIST_TYPES } from "./config"

// Local replacement for lodash/sumBy to avoid adding lodash to the shared library.
const sumBy = <T>(arr: T[], fn: (x: T) => number) => arr.reduce((s, x) => s + fn(x), 0)

export const createLinkNode = (href: string, text: string) => ({
  type: "link",
  href,
  children: [{ text }],
})

export const removeLink = (editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n["type"] === "link",
  })
}

/** Create a fresh inline tooltip element with an empty rich-text body and an empty anchor text. */
export const createTooltipNode = () => ({
  type: "tooltip" as const,
  body: [{ type: "paragraph" as const, children: [{ text: "" }] }],
  children: [{ text: "" }],
})

/** Unwrap any tooltip element matching `opts.at` (or the current selection if not given). */
export const removeTooltip = (editor: BaseEditor, opts: { at?: Path } = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n["type"] === "tooltip",
  })
}

/** Returns true if the current selection is inside a tooltip element. */
export const isTooltipActive = (editor: BaseEditor) => {
  if (!editor.selection) {
    return false
  }
  const match = Editor.above(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n["type"] === "tooltip",
  })
  return !!match
}

export const createParagraphNode = (children = [{ text: " " }]) => ({
  type: "paragraph",
  children,
})

export const withLinks = editor => {
  const { isInline } = editor

  editor.isInline = element => (element["type"] === "link" ? true : isInline(element))

  return editor
}

/**
 * Slate plugin that registers `tooltip` as an inline element and removes any tooltip
 * whose anchor text (`children`) is empty, so the rich body doesn't dangle without a trigger.
 */
export const withTooltips = editor => {
  const { isInline, normalizeNode } = editor

  editor.isInline = element => (element["type"] === "tooltip" ? true : isInline(element))

  editor.normalizeNode = entry => {
    const [node, path] = entry
    // Remove a tooltip when its anchor text is fully deleted so the body has nothing to attach to.
    if (Element.isElement(node) && node["type"] === "tooltip" && Node.string(node).length === 0) {
      Transforms.removeNodes(editor, { at: path })
      return
    }
    normalizeNode(entry)
  }

  return editor
}

export const withKeyCommands = editor => {
  const { insertBreak, isVoid } = editor

  editor.insertBreak = (...args) => {
    const [parentNode, parentPath] = Editor.parent(editor, editor.selection.focus.path)

    if (isVoid(parentNode)) {
      const nextPath = Path.next(parentPath)
      Transforms.insertNodes(editor, createParagraphNode(), {
        at: nextPath,
        select: true,
      })
    } else {
      insertBreak(...args)
    }
  }

  return editor
}

export const isBlockActive = (editor: BaseEditor, format: string, blockType = "type") => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
    }),
  )

  return !!match
}

export const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && LIST_TYPES.includes(n["type"]),
    split: true,
  })

  const newProperties: Partial<Element> = {}
  newProperties["type"] = isActive ? "paragraph" : isList ? "list-item" : format

  setNodes<Element>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    wrapNodes(editor, block)
  }
}

export const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const validString = (val: string) => {
  // Function to handle if type of value from before is standard sting.
  // Conversion into Rich text
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch (e) {
      console.error(e)
      return [
        {
          children: [{ text: val }],
        },
      ]
    }
  }

  return val
}

const getTextFromDescendants = (descendants: Descendant[]): string => {
  let text = ""
  descendants.forEach(node => {
    if (Text.isText(node)) {
      text += node.text
    } else if (Node.isNode(node) && node["type"] === "link" && node["href"]) {
      text += node["href"]
    } else if (Node.isNode(node)) {
      text += getTextFromDescendants(node.children)
    }
  })
  return text
}

export const extractPlainTextFromEditor = (editorContent: Descendant[]): string => {
  return getTextFromDescendants(editorContent)
}

const recursiveCountCharactersInNode = (node: Descendant) =>
  Text.isText(node) ? node.text.length : sumBy(node.children || [], recursiveCountCharactersInNode)

// Descendant can be of the following types: Element {children: Descendant[]} and Text {text: string, ...other text styling properties}
// we need to extract from the list of Descendants only the child nodes, in case of Text descendant, it does not have a child node
const getChildNodes = (descendants: Descendant[]) => {
  return descendants?.flatMap(d => (Text.isText(d) ? d : d.children)) ?? ""
}

export const countCharactersInNode = (inputValue: Descendant[] | string) => {
  const node = {
    type: "paragraph",
    children: typeof inputValue === "string" ? validString(inputValue) : getChildNodes(inputValue),
  }

  return recursiveCountCharactersInNode(node)
}

// utils used by external components

/**
 * Returns true when a serialized RichTextEditor value has no visible text content.
 *
 * Why: Slate persists zero-text leaves with formatting marks (e.g. a lone Bold
 * press on an empty editor yields `[{"children":[{"text":"","bold":true}]}]`).
 * A naive regex or `!value`/whitespace check treats that as non-empty, which
 * blocks downstream "use a fallback when empty" logic and leaves empty
 * accordions/sections on screen. Parsing and extracting plain text makes the
 * check tolerant of any formatting or nesting.
 */
export const isRichTextEditorValueEmpty = (value: string | null | undefined): boolean => {
  if (!value) {
    return true
  }
  try {
    const parsed = JSON.parse(value)
    return extractPlainTextFromEditor(parsed).trim().length === 0
  } catch {
    return value.trim().length === 0
  }
}
