import styled from "@emotion/styled"
import { Color, computeColor } from "@new/Color"

const DEFAULT_TEXT_COLOR = computeColor([Color.Neutral, 700])
// The ui original used `text-quaternary-700` for links. The closest brand token
// in the shared library's Color enum is `Quarternary` (#1F73B7, a blue link-ish hue).
const LINK_COLOR = computeColor([Color.Quarternary, 700])
const BORDER_COLOR = computeColor([Color.Neutral, 200])

// --- Element block styles (was twMerge in components/Element.tsx) ---

export const Paragraph = styled.p({
  margin: 0,
  fontSize: "1.2rem",
  lineHeight: 1.4,
  fontWeight: 400,
  whiteSpace: "pre-wrap",
  color: DEFAULT_TEXT_COLOR,
})

export const BlockQuote = styled.blockquote({
  margin: 0,
  fontSize: "1.2rem",
  lineHeight: 1.4,
  fontWeight: 400,
  whiteSpace: "pre-wrap",
  color: DEFAULT_TEXT_COLOR,
})

export const UnorderedList = styled.ul({
  marginTop: "7.5px",
  marginBottom: "7.5px",
  listStyleType: "disc",
  paddingLeft: "1.5rem",
  color: DEFAULT_TEXT_COLOR,
})

export const OrderedList = styled.ol({
  marginTop: "7.5px",
  marginBottom: "7.5px",
  listStyleType: "decimal",
  paddingLeft: "1.5rem",
  color: DEFAULT_TEXT_COLOR,
})

export const ListItem = styled.li({
  marginTop: "2.5px",
  marginBottom: "2.5px",
  fontSize: "1.2rem",
  lineHeight: 1.4,
  fontWeight: 400,
  whiteSpace: "pre-wrap",
  color: DEFAULT_TEXT_COLOR,
})

export const Heading1 = styled.h1({
  marginTop: "10px",
  marginBottom: "10px",
  lineHeight: 1.4,
  whiteSpace: "pre-wrap",
  color: DEFAULT_TEXT_COLOR,
})

export const Heading2 = styled.h2({
  marginTop: "10px",
  marginBottom: "10px",
  lineHeight: 1.4,
  whiteSpace: "pre-wrap",
  color: DEFAULT_TEXT_COLOR,
})

export const LinkWrapper = styled.span({
  position: "relative",
  display: "inline",
  padding: 0,
})

export const DeleteLinkChip = styled.span({
  position: "absolute",
  left: 0,
  display: "flex",
  width: "120px",
  cursor: "pointer",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: computeColor([Color.White]),
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingTop: "6px",
  paddingBottom: "6px",
})

// --- Toolbar (was twMerge in components/Toolbar.tsx) ---

export const ToolbarContainer = styled.div({
  display: "flex",
  width: "fit-content",
  alignItems: "center",
  gap: "15px",
  marginBottom: "29px",
  borderRadius: "8px",
  border: `1px solid ${BORDER_COLOR}`,
  padding: "5px",
})

// --- Toolbar toggle buttons (was twMerge in components/Buttons.tsx) ---

export const ToolbarToggleSpan = styled.span<{ active: boolean; disabled?: boolean }>(p => ({
  cursor: p.disabled ? "not-allowed" : "pointer",
  display: "inline-flex",
  opacity: p.disabled ? 0.5 : 1,
  color: p.disabled
    ? computeColor([Color.Neutral, 300])
    : p.active
      ? computeColor([Color.Neutral, 900])
      : computeColor([Color.Neutral, 300]),
}))

// --- Link toolbar button (was twMerge in index.tsx LinkToolbarButton) ---

export const LinkToolbarButtonEl = styled.button<{ disabled?: boolean }>(p => ({
  display: "inline-flex",
  alignItems: "center",
  background: "none",
  border: 0,
  padding: 0,
  cursor: p.disabled ? "not-allowed" : "pointer",
  opacity: p.disabled ? 0.5 : 1,
  color: p.disabled ? computeColor([Color.Neutral, 300]) : computeColor([Color.Neutral, 900]),
}))

// --- Outer wrapper / label / editor box / error (was twMerge in index.tsx) ---

export const Wrapper = styled.div({
  display: "block",
})

export const Label = styled.label({
  display: "block",
  marginBottom: "4px",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: DEFAULT_TEXT_COLOR,
})

export const EditorBox = styled.div<{
  readOnly?: boolean
  increasedHeight?: boolean
  hasCustomMenu?: boolean
}>(p => ({
  width: "100%",
  ...(p.readOnly
    ? {}
    : {
        borderRadius: "6px",
        border: `1px solid ${BORDER_COLOR}`,
        paddingLeft: "14px",
        paddingRight: "14px",
        paddingTop: "12px",
        paddingBottom: "12px",
        ...(p.increasedHeight ? { minHeight: "150px" } : {}),
        ...(p.hasCustomMenu ? { minWidth: "400px", textAlign: "justify" } : { minWidth: "100%" }),
        "&:focus-within": {
          borderColor: LINK_COLOR,
        },
      }),
}))

export const ToolbarRow = styled.div({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
})

export const Footer = styled.div({
  marginTop: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
})

export const ErrorText = styled.span({
  color: computeColor([Color.Error, 700]),
})

export const CounterText = styled.span<{ over: boolean }>(p => ({
  fontSize: "0.75rem",
  textAlign: "right",
  color: p.over ? computeColor([Color.Error, 700]) : computeColor([Color.Neutral, 500]),
}))

// Editable styling: link color, line-height and font-size that the ui original
// applied via Tailwind arbitrary selectors on the <Editable> element.
export const EditableStyles = styled.div({
  lineHeight: 1,
  "& a": {
    color: LINK_COLOR,
  },
  "& *": {
    fontSize: "0.9rem",
  },
  "& [contenteditable]:focus-visible": {
    outline: "none",
  },
  "& p:focus-visible": {
    outline: "none",
  },
  "& ul": {
    listStyleType: "disc",
  },
})

// --- TooltipPopper styles (was twMerge in components/TooltipPopper.tsx) ---

export const TooltipTrigger = styled.span({
  cursor: "help",
  borderBottom: "1.5px dotted currentColor",
})

export const TooltipPanel = styled.div({
  maxHeight: "60vh",
  maxWidth: "400px",
  minWidth: "280px",
  overflowY: "auto",
  borderRadius: "6px",
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: computeColor([Color.White]),
  padding: "12px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
})

export const TooltipPanelFooter = styled.div({
  marginTop: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
})

export const TooltipDeleteButton = styled.button({
  display: "inline-flex",
  alignItems: "center",
  background: "none",
  border: 0,
  cursor: "pointer",
  padding: "4px",
})

export const TooltipHint = styled.span({
  fontSize: "0.75rem",
  color: computeColor([Color.Neutral, 500]),
})

// --- "Add link" form (rendered inside a Popover) ---

export const LinkFormContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "16px",
  minWidth: "320px",
})

export const LinkFormTitle = styled.span({
  fontSize: "0.875rem",
  fontWeight: 700,
  color: DEFAULT_TEXT_COLOR,
})

export const LinkFormActions = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
})
