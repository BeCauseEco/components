import styled from "@emotion/styled"
import React, { ReactElement } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { AlignProps } from "@new/Stack/Align"
import { keyframes } from "@emotion/react"
import { Color, computeColor } from "@new/Color"
import { Stack } from "@new/Stack/Stack"

export type TooltipProps = ComponentBaseProps & {
  // colorArrow: Color

  trigger: ReactElement

  children: ReactElement<AlignProps>
}

const slideUpAndFade = keyframes({
  from: { opacity: 0, transform: "translateY(2px)" },
  to: { opacity: 1, transform: "translateY(0)" },
})

const slideRightAndFade = keyframes({
  from: { opacity: 0, transform: "translateX(-2px)" },
  to: { opacity: 1, transform: "translateX(0)" },
})

const slideDownAndFade = keyframes({
  from: { opacity: 0, transform: "translateY(-2px)" },
  to: { opacity: 1, transform: "translateY(0)" },
})

const slideLeftAndFade = keyframes({
  from: { opacity: 0, transform: "translateX(2px)" },
  to: { opacity: 1, transform: "translateX(0)" },
})

const Root = styled(RadixTooltip.Root)({
  display: "flex",
  flexDirection: "column",
})

const Content = styled(RadixTooltip.Content)({
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  zIndex: 999999,
  userSelect: "none",

  ":focus": {
    outline: "none",
  },

  "&[data-state='open'][data-side='top']": {
    animationName: slideDownAndFade,
  },

  "&[data-state='open'][data-side='right']": {
    animationName: slideLeftAndFade,
  },

  "&[data-state='open'][data-side='bottom']": {
    animationName: slideUpAndFade,
  },

  "&[data-state='open'][data-side='left']": {
    animationName: slideRightAndFade,
  },
})

const Arrow = styled(RadixTooltip.Arrow)({
  fill: computeColor([Color.White]),
})

const Trigger = styled(RadixTooltip.Trigger)({
  all: "unset",
  display: "inherit",
  flexDirection: "inherit",
  cursor: "help",
  borderBottom: `2px dotted ${computeColor([Color.Neutral, 200])}`,
})

export const Tooltip = (p: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={100} skipDelayDuration={0}>
      <Root>
        <Trigger>{p.trigger}</Trigger>

        <RadixTooltip.Portal>
          <Content sideOffset={5}>
            <Stack vertical hug="partly" fill={[Color.White]} cornerRadius="medium" dropShadow="medium">
              {p.children}
            </Stack>

            <Arrow />
          </Content>
        </RadixTooltip.Portal>
      </Root>
    </RadixTooltip.Provider>
  )
}
