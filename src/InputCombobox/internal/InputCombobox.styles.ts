import styled from "@emotion/styled"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Color, ColorWithLightness, computeColor } from "@new/Color"
import { InputComboboxProps } from "../InputCombobox"

export const Container = styled.div<Pick<InputComboboxProps, "size" | "width">>(p => ({
  display: "flex",
  flexDirection: "column",
  width: p.width === "fixed" ? (p.size === "small" ? "calc(var(--BU) * 70)" : "calc(var(--BU) * 80)") : "auto",
}))

export const CommandGroupStyled = styled(CommandGroup)({
  margin: "0 0 10px 0",

  "[cmdk-group-heading]": {
    color: computeColor([Color.Neutral, 400]),
    fontSize: "14px",
    marginBottom: "5px",
  },
})

export const CommandItemStyled = styled(CommandItem)<{
  multiple?: boolean
  selected: boolean
  colorSelected: ColorWithLightness
  colorBackgroundHover: ColorWithLightness
  colorForeground: ColorWithLightness
}>(p => ({
  position: "relative",
  padding: p.multiple ? "calc(var(--BU) * 1)" : "calc(var(--BU) * 1.5) ",
  borderRadius: "var(--BU)",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "transparent",

  "&[data-selected='true']": {
    backgroundColor: computeColor(p.colorBackgroundHover),
  },
}))

export const CommandEmptyStyled = styled(CommandEmpty)({
  padding: "calc(var(--BU) * 1.5) 0",
  userSelect: "none",
  maxWidth: "100%",
  overflow: "hidden",
})

export const LabelContainer = styled.div({
  display: "flex",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",

  "& [class^='<Badge']:not(:nth-child(n+4))": {
    minWidth: "25%",
  },
})

export const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
  alignItems: "center",
})
