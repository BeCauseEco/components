import React, { ReactElement } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { AlignProps } from "@new/Stack/Align"
import { Color, computeColor } from "@new/Color"
import { Stack } from "@new/Stack/Stack"

export type TooltipProps = ComponentBaseProps & {
  // colorArrow: Color

  trigger: ReactElement

  hug?: boolean
  highlight?: boolean

  children: ReactElement<AlignProps>
}

const triggerWrapperStyle: React.CSSProperties = {
  all: "unset",
  display: "inline-flex",
  flexDirection: "inherit",
  width: "inherit",
  // Without this, the trigger is a flex item with the default `min-width: auto` and refuses to
  // shrink below its content's intrinsic width — breaking text truncation in tooltip-wrapped
  // table cells (e.g. long titles overflowing and overlapping end adornments). Allow it to shrink.
  minWidth: 0,
  height: "inherit",
  justifyContent: "inherit",
  alignItems: "inherit",
  userSelect: "all",
}

const triggerHighlightStyle: React.CSSProperties = {
  cursor: "help",
  borderBottom: `2px dotted ${computeColor([Color.Neutral, 200])}`,
}

const contentStyle: React.CSSProperties = {
  zIndex: 999999,
  maxWidth: "calc(var(--BU) * 160)",
}

export const Tooltip = (p: TooltipProps) => {
  const wrapperStyle = p.highlight ? { ...triggerWrapperStyle, ...triggerHighlightStyle } : triggerWrapperStyle

  return (
    <RadixTooltip.Provider delayDuration={200} skipDelayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger style={wrapperStyle}>{p.trigger}</RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content side="bottom" sideOffset={4} alignOffset={4} align="start" style={contentStyle}>
            <Stack
              vertical
              hug={p.hug ? true : "partly"}
              fill={[Color.White]}
              cornerRadius="medium"
              dropShadow="medium"
            >
              {p.children}
            </Stack>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
