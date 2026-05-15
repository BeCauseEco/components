import { Descendant, Editor, Element as SlateElement, Transforms } from "slate"
import { ReactEditor, RenderElementProps, useReadOnly, useSelected, useSlateStatic } from "slate-react"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import { removeLink, removeTooltip } from "../utils"
import { TooltipPopper } from "./TooltipPopper"
import {
  BlockQuote,
  DeleteLinkChip,
  Heading1,
  Heading2,
  LinkWrapper,
  ListItem,
  OrderedList,
  Paragraph,
  UnorderedList,
} from "../RichTextEditor.styles"

type CustomElement =
  | { type: "paragraph"; children: unknown[] }
  | { type: "heading-one"; children: unknown[] }
  | { type: "heading-two"; children: unknown[] }
  | { type: "block-quote"; children: unknown[] }
  | { type: "bulleted-list"; children: unknown[] }
  | { type: "numbered-list"; children: unknown[] }
  | { type: "list-item"; children: unknown[] }
  | { type: "link"; href: string; children: unknown[] }
  | { type: "tooltip"; body: Descendant[]; children: unknown[] }

type ElementProps = RenderElementProps & {
  color?: string
}

const Element = ({ attributes, children, element, color }: ElementProps) => {
  const editor = useSlateStatic()
  const selected = useSelected()
  const readOnly = useReadOnly()
  const style = color ? { color } : undefined
  const node = element as CustomElement

  switch (node.type) {
    case "block-quote":
      return (
        <BlockQuote {...attributes} style={style}>
          {children}
        </BlockQuote>
      )

    case "bulleted-list":
      return (
        <UnorderedList {...attributes} style={style}>
          {children}
        </UnorderedList>
      )

    case "numbered-list":
      return (
        <OrderedList {...attributes} style={style}>
          {children}
        </OrderedList>
      )

    case "list-item":
      return (
        <ListItem {...attributes} style={style}>
          {children}
        </ListItem>
      )

    case "heading-one":
      return (
        <Heading1 {...attributes} style={style}>
          {children}
        </Heading1>
      )

    case "heading-two":
      return (
        <Heading2 {...attributes} style={style}>
          {children}
        </Heading2>
      )

    case "link":
      return (
        <LinkWrapper>
          <a {...attributes} href={node.href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
          {selected && (
            <DeleteLinkChip contentEditable={false} onClick={() => removeLink(editor)}>
              Delete link
              <Icon name="delete" fill={[Color.Error, 700]} small />
            </DeleteLinkChip>
          )}
        </LinkWrapper>
      )

    case "tooltip": {
      const updateBody = (next: Descendant[]) => {
        const path = ReactEditor.findPath(editor as ReactEditor, element as SlateElement)
        Transforms.setNodes(editor, { body: next } as Partial<SlateElement>, { at: path })
      }
      const deleteSelf = () => {
        const path = ReactEditor.findPath(editor as ReactEditor, element as SlateElement)
        removeTooltip(editor, { at: path })
      }
      const closeEditor = () => {
        // Move the editor selection just past this tooltip so the popper's `selected`
        // derivation flips false and the editor closes.
        const path = ReactEditor.findPath(editor as ReactEditor, element as SlateElement)
        const after = Editor.after(editor, path)
        if (after) {
          Transforms.select(editor, after)
        } else {
          Transforms.deselect(editor)
        }
      }
      return (
        <TooltipPopper
          body={node.body}
          attributes={attributes}
          readOnly={readOnly}
          selected={selected}
          onUpdateBody={updateBody}
          onDelete={deleteSelf}
          onCloseEditor={closeEditor}
        >
          {children}
        </TooltipPopper>
      )
    }

    default:
      return (
        <Paragraph {...attributes} style={style}>
          {children}
        </Paragraph>
      )
  }
}

export default Element
