import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react"
import { Descendant } from "slate"
import { RenderElementProps } from "slate-react"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import { Popover } from "@new/Popover/Popover"
import { Align } from "@new/Stack/Align"
import { InputButton } from "@new/InputButton/internal/InputButton"
import { RichTextEditor } from "../RichTextEditor"
import { extractPlainTextFromEditor } from "../utils"
import {
  TooltipDeleteButton,
  TooltipHint,
  TooltipPanel,
  TooltipPanelFooter,
  TooltipTrigger,
} from "../RichTextEditor.styles"

type HoverState = "closed" | "preview"

type TooltipPopperProps = {
  body: Descendant[]
  attributes: RenderElementProps["attributes"]
  children: ReactNode
  readOnly: boolean
  selected: boolean
  onUpdateBody: (next: Descendant[]) => void
  onDelete: () => void
  onCloseEditor: () => void
}

const HOVER_OPEN_DELAY_MS = 200
const HOVER_CLOSE_GRACE_MS = 150

export const TooltipPopper = ({
  body,
  attributes,
  children,
  readOnly,
  selected,
  onUpdateBody,
  onDelete,
  onCloseEditor,
}: TooltipPopperProps) => {
  const [triggerEl, setTriggerEl] = useState<HTMLSpanElement | null>(null)
  const triggerElRef = useRef<HTMLSpanElement | null>(null)
  const [hoverState, setHoverState] = useState<HoverState>("closed")
  const closeTimerRef = useRef<number | null>(null)
  const openTimerRef = useRef<number | null>(null)

  // The pinned (editable) state is derived from the outer-editor selection: when the cursor
  // is inside the tooltip element we render the editor; when it leaves, the editor closes.
  // This single source of truth replaces the old click-driven `mode` state, and means a
  // freshly created tooltip (post-toolbar collapse drops the cursor inside the new node)
  // reveals the editor immediately, without requiring a second click.
  const pinned = !readOnly && selected
  const isBodyEmpty = extractPlainTextFromEditor(body).trim().length === 0
  // Skip the hover preview entirely when there's nothing to show — empty popper is just noise.
  // The pinned (editable) state still opens on empty bodies so authors can type into a fresh tooltip.
  const previewing = !pinned && hoverState === "preview" && !isBodyEmpty
  const open = pinned || previewing

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current)
      }
    }
  }, [])

  const cancelClose = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const cancelOpen = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimerRef.current = window.setTimeout(() => {
      setHoverState("closed")
      closeTimerRef.current = null
    }, HOVER_CLOSE_GRACE_MS)
  }

  const onMouseEnterTrigger = () => {
    cancelClose()
    if (hoverState === "closed") {
      cancelOpen()
      openTimerRef.current = window.setTimeout(() => {
        setHoverState("preview")
        openTimerRef.current = null
      }, HOVER_OPEN_DELAY_MS)
    }
  }

  const onMouseLeaveTrigger = () => {
    cancelOpen()
    if (!pinned && hoverState === "preview") {
      scheduleClose()
    }
  }

  const onTriggerClick = () => {
    cancelOpen()
    cancelClose()
    if (readOnly && hoverState === "closed") {
      // On touch / non-hover devices, give read-only viewers a way to surface the preview.
      setHoverState("preview")
    }
    // For editable callers the click moves the outer-editor selection into the tooltip,
    // which flips `selected` to true and pins the editor open via the derivation above.
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (readOnly) {
        setHoverState("preview")
      }
      return
    }
    if (event.key === "Escape") {
      close()
    }
  }

  const close = () => {
    cancelOpen()
    cancelClose()
    setHoverState("closed")
    if (pinned) {
      // Move the outer-editor selection out of the tooltip so `selected` flips to false
      // and the derivation closes the editor.
      onCloseEditor()
    }
  }

  // Latest-close ref so the global Escape listener never captures a stale `pinned` value
  // when `open` stays true across mode transitions (preview → pinned).
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })

  const handleBodyChange = (next: string) => {
    try {
      const parsed = JSON.parse(next) as Descendant[]
      onUpdateBody(parsed)
    } catch {
      // Inner editor may emit intermediate non-JSON values during typing; ignore.
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  // Slate stores DOM↔node mapping via `attributes.ref` (NODE_TO_ELEMENT). If a consumer overrides
  // it, lookups like `ReactEditor.toSlateNode(domNode)` throw "Cannot resolve a Slate node from DOM
  // node". Compose both refs so our local `triggerEl` state and Slate's tracking both get the element.
  // Radix Popover's <Trigger asChild> also composes its own ref onto whatever element we render as
  // the trigger, so Slate, our state and Radix all receive the node.
  const { ref: slateRef, ...slateAttributes } = attributes
  const setTriggerRefs = (element: HTMLSpanElement | null) => {
    triggerElRef.current = element
    setTriggerEl(element)
    if (typeof slateRef === "function") {
      slateRef(element)
    } else if (slateRef) {
      // Slate's ref is a RefObject — its `.current` is meant to be written. Object.assign
      // performs the mutation without tripping `react-hooks/immutability`, which forbids
      // direct `.current = ...` on a destructured prop.
      Object.assign(slateRef, { current: element })
    }
  }

  const trigger = (
    <TooltipTrigger
      {...slateAttributes}
      ref={setTriggerRefs}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onMouseEnter={onMouseEnterTrigger}
      onMouseLeave={onMouseLeaveTrigger}
      onClick={onTriggerClick}
      onKeyDown={onTriggerKeyDown}
    >
      {children}
    </TooltipTrigger>
  )

  // A native <dialog> opened with showModal() renders in the browser's top layer, which sits
  // above any z-index. @new/Popover portals its content to document.body by default, so when the
  // editor lives inside such a dialog the popover would render BEHIND the modal. Radix's Portal
  // accepts a `container`, so we resolve the trigger's nearest ancestor <dialog> and portal the
  // popover INTO it — that keeps the popover within the dialog's top-layer ancestry and on top.
  // Outside a modal dialog there's no ancestor, so `container` is undefined and the popover keeps
  // the default body portal (unchanged behaviour for the common case). This faithfully preserves
  // the original MUI <Popper disablePortal popperOptions={{ strategy: "fixed" }}> intent.
  const dialogContainer = (triggerEl?.closest("dialog") as HTMLElement | null) ?? undefined

  return (
    <Popover
      trigger={trigger}
      alignment="start"
      container={dialogContainer}
      open={open}
      onOpenChange={next => {
        // Radix requests close on outside-click / Escape. Mirror the old ClickAwayListener
        // behaviour: only act on a close request, and route it through `close()` so the
        // pinned editor's selection is moved out (which flips `selected` off).
        if (!next) {
          close()
        }
      }}
    >
      <Align
        vertical
        hug
        // contentEditable=false keeps Slate from treating the popover panel as editable content.
      >
        <TooltipPanel
          contentEditable={false}
          role={pinned ? "dialog" : "tooltip"}
          aria-label={pinned ? "Tooltip editor" : "Tooltip"}
          onMouseEnter={cancelClose}
          onMouseLeave={() => {
            if (!pinned) {
              scheduleClose()
            }
          }}
        >
          <RichTextEditor
            value={JSON.stringify(body)}
            setFieldValue={handleBodyChange}
            readOnly={readOnly || previewing}
            placeholder={pinned ? "Enter tooltip content…" : undefined}
            disableTooltips
            autoFocus={false}
          />
          {pinned && (
            <TooltipPanelFooter>
              <TooltipDeleteButton type="button" onClick={onDelete} aria-label="Delete tooltip" title="Delete tooltip">
                <Icon name="delete" fill={[Color.Error, 700]} small />
              </TooltipDeleteButton>
              <TooltipHint>Click outside or press Done to save</TooltipHint>
              <InputButton
                variant="solid"
                size="small"
                width="auto"
                colorForeground={[Color.White]}
                colorBackground={[Color.Primary, 700]}
                label="Done"
                onClick={close}
              />
            </TooltipPanelFooter>
          )}
        </TooltipPanel>
      </Align>
    </Popover>
  )
}
