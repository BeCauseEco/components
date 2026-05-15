import { MouseEvent, ReactNode } from "react"
import { Range, Transforms } from "slate"
import { useSlate } from "slate-react"
import { createTooltipNode, isBlockActive, isMarkActive, isTooltipActive, toggleBlock, toggleMark } from "../utils"
import { ToolbarToggleSpan } from "../RichTextEditor.styles"

type ToolbarToggleProps = {
  active: boolean
  label: string
  onMouseDown: (event: MouseEvent<HTMLSpanElement>) => void
  children: ReactNode
}

const ToolbarToggle = ({ active, label, onMouseDown, children }: ToolbarToggleProps) => (
  <ToolbarToggleSpan onMouseDown={onMouseDown} title={label} aria-label={label} role="button" active={active}>
    {children}
  </ToolbarToggleSpan>
)

type ButtonProps = {
  format: string
  label: string
  children: ReactNode
}

export const BlockButton = ({ format, label, children }: ButtonProps) => {
  const editor = useSlate()
  return (
    <ToolbarToggle
      active={isBlockActive(editor, format)}
      label={label}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {children}
    </ToolbarToggle>
  )
}

export const MarkButton = ({ format, label, children }: ButtonProps) => {
  const editor = useSlate()
  return (
    <ToolbarToggle
      active={isMarkActive(editor, format)}
      label={label}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {children}
    </ToolbarToggle>
  )
}

export const TooltipButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const editor = useSlate()
  const { selection } = editor
  const inTooltip = isTooltipActive(editor)
  const collapsed = !selection || Range.isCollapsed(selection)
  const disabled = collapsed || inTooltip

  const onMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    if (disabled) {
      return
    }
    Transforms.wrapNodes(editor, createTooltipNode(), { split: true })
    Transforms.collapse(editor, { edge: "end" })
  }

  const tooltipText = inTooltip
    ? "Tooltip (selection is already inside a tooltip)"
    : collapsed
      ? "Tooltip (select text first)"
      : label

  return (
    <ToolbarToggleSpan
      onMouseDown={onMouseDown}
      aria-disabled={disabled}
      aria-label={label}
      title={tooltipText}
      role="button"
      active={!disabled}
      disabled={disabled}
    >
      {children}
    </ToolbarToggleSpan>
  )
}
