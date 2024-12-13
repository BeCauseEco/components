import styled from "@emotion/styled"
import React, { ReactElement } from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { keyframes } from "@emotion/react"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { Align, AlignProps } from "@new/Stack/Align"
import { Stack } from "@new/Stack/Stack"
import { Color } from "@new/Color"

export type PopoverProps = ComponentBaseProps & {
  // colorArrow: Color

  trigger: ReactElement
  alignment: "start" | "middle" | "end"

  open?: boolean
  onOpenChange?: (value: boolean) => void

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

const Root = styled(RadixPopover.Root)({
  display: "flex",
  flexDirection: "column",
})

const Content = styled(RadixPopover.Content)({
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  zIndex: 999999,

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

// const Arrow = styled(RadixPopover.Arrow)<Pick<TPopover, "colorArrow">>(p => ({
//   fill: computeColor([p.colorArrow, 700]),
// }))

export const Popover = (p: PopoverProps) => {
  return (
    <Root open={p.open} onOpenChange={p.onOpenChange}>
      <RadixPopover.Trigger asChild>{p.trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <Content
          // @ts-expect-error Radix doesn't expose a type for this
          align={p.alignment}
          data-playwright-testid={p.playwrightTestId}
        >
          <Stack vertical fill={[Color.White]} hug="partly" dropShadow="medium" cornerRadius="medium">
            <Align vertical topLeft>
              {p.children}
            </Align>
          </Stack>

          {/* <Arrow colorArrow={colorArrow} width={Size.Small} height={Size.Xsmall} /> */}
        </Content>
      </RadixPopover.Portal>
    </Root>
  )
}
