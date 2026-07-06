import React, { ComponentProps, Ref, useCallback, useMemo, useRef, useState } from "react"
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, useSlate, withReact } from "slate-react"
import { createEditor, Descendant, Editor, Element as SlateElement, Path, Range, Transforms } from "slate"
import { withHistory } from "slate-history"
import isHotkey from "is-hotkey"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { Align } from "@new/Stack/Align"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { PlaywrightProps } from "@new/Playwright"
import {
  countCharactersInNode,
  createLinkNode,
  createParagraphNode,
  removeLink,
  toggleMark,
  validString,
  withKeyCommands,
  withLinks,
  withTooltips,
} from "./utils"
import { HOTKEYS, TOOLBAR_ITEMS } from "./config"
import Leaf from "./internal/Leaf"
import Element from "./internal/Element"
import { Toolbar } from "./internal/Toolbar"
import { BlockButton, MarkButton, TooltipButton } from "./internal/Buttons"
import {
  CounterText,
  EditableStyles,
  EditorBox,
  ErrorText,
  Footer,
  Label,
  LinkFormActions,
  LinkFormContainer,
  LinkFormTitle,
  LinkToolbarButtonEl,
  ToolbarRow,
  Wrapper,
} from "./RichTextEditor.styles"

// Local replacement for lodash/fp/pipe to avoid adding lodash to the shared library.
const pipe =
  <T,>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value)

type LinkValues = { url: string; title: string }

type LinkPopoverProps = {
  onSubmit: (values: LinkValues) => void
  onCancel: () => void
  trigger: React.ReactElement
  open: boolean
  onOpenChange: (open: boolean) => void
  container?: HTMLElement
}

const LinkPopover = ({ onSubmit, onCancel, trigger, open, onOpenChange, container }: LinkPopoverProps) => {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  const submit = () => {
    if (!url) {
      onCancel()
      return
    }
    onSubmit({ url, title })
  }

  return (
    <Popover
      trigger={trigger}
      alignment="start"
      container={container}
      open={open}
      onOpenChange={next => {
        if (next) {
          // LinkPopover stays mounted across open/close cycles (the trigger is always in the
          // toolbar), so stale values from the previous link would linger — clear them on open.
          setUrl("")
          setTitle("")
        } else {
          onCancel()
        }
        onOpenChange(next)
      }}
    >
      <Align vertical hug>
        <LinkFormContainer>
          <LinkFormTitle>Add link</LinkFormTitle>
          <InputTextSingle
            size="small"
            width="auto"
            color={Color.Neutral}
            label={["outside-small", "URL"]}
            value={url}
            onChange={setUrl}
          />
          <InputTextSingle
            size="small"
            width="auto"
            color={Color.Neutral}
            label={["outside-small", "Title"]}
            value={title}
            onChange={setTitle}
          />
          <LinkFormActions>
            <InputButton
              variant="outlined"
              size="small"
              width="auto"
              colorForeground={[Color.Neutral, 700]}
              borderColor={[Color.Neutral, 300]}
              label="Cancel"
              onClick={onCancel}
            />
            <InputButton
              variant="solid"
              size="small"
              width="auto"
              colorForeground={[Color.White]}
              colorBackground={[Color.Primary, 700]}
              label="Add link"
              onClick={submit}
            />
          </LinkFormActions>
        </LinkFormContainer>
      </Align>
    </Popover>
  )
}

type LinkToolbarButtonProps = ComponentProps<"button"> & {
  ref?: Ref<HTMLButtonElement>
}

// Used as the `asChild` child of Radix Popover.Trigger, which injects props onto this element:
// `ref` (the popper anchor) and `onClick` (open/close toggle). Both MUST reach the DOM button —
// without the anchor ref, Radix cannot position the popover and parks it off-screen
// (`translate(0, -200%)`), which reads as "the button does nothing".
const LinkToolbarButton = ({ ref, ...props }: LinkToolbarButtonProps) => {
  const editor = useSlate()
  const disabled = !editor.selection || Range.isCollapsed(editor.selection)
  const title = disabled ? "Link (select text first)" : TOOLBAR_ITEMS.link.label
  return (
    <LinkToolbarButtonEl
      {...props}
      ref={ref}
      type="button"
      disabled={disabled}
      title={title}
      aria-label={TOOLBAR_ITEMS.link.label}
      // preventDefault keeps focus — and thereby the Slate text selection being linked — in the
      // editor. Opening is left to Radix's injected click handler above.
      onMouseDown={event => event.preventDefault()}
    >
      <Icon name="link" fill={disabled ? [Color.Neutral, 300] : [Color.Neutral, 900]} small />
    </LinkToolbarButtonEl>
  )
}

export type RichTextEditorProps = PlaywrightProps & {
  /**
   * Editor content as a JSON string of Slate `Descendant[]`.
   *
   * IMPORTANT — value semantics differ by mode:
   *
   * - **Editable mode** (`readOnly` falsy): `value` is read **once on mount** and the editor
   *   is then **uncontrolled** — Slate owns the document and subsequent `value` prop changes
   *   are ignored. ~40 ui consumers rely on this (it prevents the user's in-progress edits
   *   from being clobbered by parent re-renders). To reset or replace the content externally,
   *   the consumer must **remount** the component (e.g. give it a React `key` that changes
   *   when the desired content changes).
   * - **readOnly mode**: the component remounts automatically whenever `value` changes (an
   *   internal `key={value}` is applied), so it always reflects the latest `value`.
   *
   * `setFieldValue` is the source of truth for outgoing changes in editable mode.
   */
  value: string
  label?: string
  maxCounter?: number
  error?: string
  readOnly?: boolean
  placeholder?: string
  color?: string
  setFieldValue?: (value: string) => void
  className?: string
  customMenu?: React.ReactNode
  increasedHeight?: boolean
  maxWidth?: string
  disabled?: boolean
  autoFocus?: boolean
  disableTooltips?: boolean
}

const createEditorWithPlugins = pipe(withReact, withHistory, withLinks, withTooltips, withKeyCommands)

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      label,
      maxCounter,
      error,
      readOnly,
      placeholder,
      color,
      setFieldValue,
      className,
      customMenu,
      increasedHeight,
      maxWidth,
      autoFocus = true,
      disableTooltips,
      ...p
    },
    ref,
  ) => {
    const renderElement = useCallback(
      (props: RenderElementProps) => <Element {...props} color={color} disableTooltips={disableTooltips} />,
      [color, disableTooltips],
    )
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
    const editor = useMemo(() => createEditorWithPlugins(createEditor()), [])
    const [currentCounter, setCurrentCounter] = useState(countCharactersInNode(value))
    const [isLinkDialogOpen, setLinkDialogOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const [linkDialogContainer, setLinkDialogContainer] = useState<HTMLElement | undefined>(undefined)

    const handleAddLink = ({ url, title }: LinkValues) => {
      if (!url) {
        return
      }

      const { selection } = editor
      if (!selection) {
        return
      }

      const link = createLinkNode(url, title)

      ReactEditor.focus(editor)

      const [parentNode, parentPath] = Editor.parent(editor, selection.focus.path)

      // Remove the Link node if we're inserting a new link node inside of another link.
      if (SlateElement.isElement(parentNode) && parentNode["type"] === "link") {
        removeLink(editor)
      }

      if (editor.isVoid(parentNode)) {
        Transforms.insertNodes(editor, createParagraphNode(link.children), {
          at: Path.next(parentPath),
          select: true,
        })
      } else if (Range.isCollapsed(selection)) {
        Transforms.insertNodes(editor, link, { select: true })
      } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: "end" })
      }
    }

    const closeLinkDialog = () => setLinkDialogOpen(false)
    const submitLinkDialog = (values: LinkValues) => {
      closeLinkDialog()
      handleAddLink(values)
    }

    // A native <dialog> opened with showModal() renders in the browser's top layer, above
    // anything portaled to document.body — the popover's default portal target. When the editor
    // sits inside such a dialog, portal the link popover INTO it so it stays visible (same fix
    // as TooltipPopper; see the detailed comment there). Resolved at open time because the
    // ancestry can change between opens; outside a modal dialog this stays undefined and the
    // default body portal is kept.
    const handleLinkDialogOpenChange = (next: boolean) => {
      if (next) {
        setLinkDialogContainer(wrapperRef.current?.closest("dialog") ?? undefined)
      }
      setLinkDialogOpen(next)
    }

    const handleChange = (val: Descendant[]) => {
      if (readOnly) {
        return
      }
      setCurrentCounter(countCharactersInNode(val))
      setFieldValue?.(JSON.stringify(val))
    }

    const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event.nativeEvent)) {
          event.preventDefault()
          const mark = HOTKEYS[hotkey]
          toggleMark(editor, mark)
        }
      }
    }

    return (
      <Wrapper ref={wrapperRef}>
        {label && <Label>{label}</Label>}
        <EditorBox
          ref={ref}
          // The ui original merged the consumer `className` onto the inner editor-box div
          // (the bordered/padded container), not the outer wrapper. Preserve that semantics
          // so consumer layout/spacing overrides land on the same element as before.
          className={className}
          readOnly={readOnly}
          increasedHeight={increasedHeight}
          hasCustomMenu={!!customMenu}
          style={{ maxWidth }}
        >
          <Slate
            // <Slate initialValue> is read ONCE on mount. Editable mode is therefore
            // UNCONTROLLED: `value` prop changes after mount are intentionally ignored so
            // the user's in-progress edits survive parent re-renders (~40 ui consumers
            // depend on this). Consumers that need to reset/replace content externally must
            // remount via a changing React `key`. readOnly mode opts INTO remount-on-change
            // by keying on `value` below, so it always shows the latest server content.
            key={readOnly ? value : undefined}
            editor={editor}
            initialValue={validString(value ?? "")}
            onChange={handleChange}
          >
            {!readOnly && (
              <ToolbarRow>
                <Toolbar>
                  {TOOLBAR_ITEMS.marks.map(({ format, label: markLabel, iconName }) => (
                    <MarkButton format={format} label={markLabel} key={format}>
                      <Icon name={iconName} fill={[Color.Neutral, 900]} small />
                    </MarkButton>
                  ))}
                  <LinkPopover
                    key="link"
                    open={isLinkDialogOpen}
                    onOpenChange={handleLinkDialogOpenChange}
                    onSubmit={submitLinkDialog}
                    onCancel={closeLinkDialog}
                    container={linkDialogContainer}
                    trigger={<LinkToolbarButton />}
                  />
                  {!disableTooltips && (
                    <TooltipButton key="tooltip" label={TOOLBAR_ITEMS.tooltip.label}>
                      <Icon name={TOOLBAR_ITEMS.tooltip.iconName} fill={[Color.Neutral, 900]} small style="outlined" />
                    </TooltipButton>
                  )}
                  {TOOLBAR_ITEMS.blocks.map(({ format, label: blockLabel, iconName }) => (
                    <BlockButton format={format} label={blockLabel} key={format}>
                      <Icon name={iconName} fill={[Color.Neutral, 900]} small />
                    </BlockButton>
                  ))}
                </Toolbar>
                {customMenu}
              </ToolbarRow>
            )}
            <EditableStyles>
              <Editable
                data-playwright-testid={p["data-playwright-testid"]}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder={placeholder}
                spellCheck
                autoFocus={autoFocus}
                readOnly={readOnly}
                onKeyDown={handleEditorKeyDown}
              />
            </EditableStyles>
          </Slate>
        </EditorBox>
        <Footer>
          {!!maxCounter && (
            <CounterText over={currentCounter > maxCounter}>
              {currentCounter} / {maxCounter}
            </CounterText>
          )}
          {!!error && <ErrorText>{error}</ErrorText>}
        </Footer>
      </Wrapper>
    )
  },
)

RichTextEditor.displayName = "RichTextEditor"
