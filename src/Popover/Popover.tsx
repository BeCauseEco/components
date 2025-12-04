import styled from "@emotion/styled"
import React, { ReactElement } from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { keyframes } from "@emotion/react"
import { ComponentBaseProps } from "@new/ComponentBaseProps"
import { AlignProps } from "@new/Stack/Align"
import { Stack } from "@new/Stack/Stack"
import { Color } from "@new/Color"
import { generateErrorStyles, useValidateChildren } from "@new/useValidateChildren"

export type PopoverProps = ComponentBaseProps & {
  // colorArrow: Color

  trigger: ReactElement
  alignment: "start" | "middle" | "end"

  open?: boolean
  onOpenChange?: (value: boolean) => void

  children: ReactElement<AlignProps>

  container?: HTMLElement
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

const Content = styled(RadixPopover.Content)<Pick<PopoverProps, "validateChildrenErrorStyles">>(p => ({
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

  ...p.validateChildrenErrorStyles,
}))

// const Arrow = styled(RadixPopover.Arrow)<Pick<TPopover, "colorArrow">>(p => ({
//   fill: computeColor([p.colorArrow, 700]),
// }))

export const Popover = (p: PopoverProps) => {
  const [invalidChildren] = useValidateChildren("Popover", ["Align"], ["Popover"], p.children)

  return (
    <Root open={p.open} onOpenChange={p.onOpenChange}>
      <RadixPopover.Trigger asChild>{p.trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal container={p.container}>
        <Content
          // @ts-expect-error Radix doesn't expose a type for this
          align={p.alignment}
          validateChildrenErrorStyles={generateErrorStyles(invalidChildren)}
          data-playwright-testid={p["data-playwright-testid"]}
        >
          <Stack vertical fill={[Color.White]} hug="partly" dropShadow="medium" cornerRadius="medium">
            {p.children}
          </Stack>

          {/* <Arrow colorArrow={colorArrow} width={Size.Small} height={Size.Xsmall} /> */}
        </Content>
      </RadixPopover.Portal>
    </Root>
  )
}
