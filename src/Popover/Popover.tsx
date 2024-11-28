import styled from "@emotion/styled"
import React, { ReactElement } from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { keyframes } from "@emotion/react"
// import { Color, computeColor } from "@new/Color"
// import { Size } from "@new/Size"
import { EAlignment } from "@new/EAlignment"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { Composition } from "@new/Composition/Composition"
import { PlaywrightProps } from "@new/Playwright"

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

const alignTranslate = (alignment: EAlignment) => {
  switch (alignment) {
    case EAlignment.Start:
      return "start"

    case EAlignment.Middle:
      return "center"

    case EAlignment.End:
      return "end"
  }
}

export type TPopover = PlaywrightProps & {
  // colorArrow: Color
  open?: boolean
  onOpenChange?: (value: boolean) => void
  trigger: ReactElement
  background: ReactElement<TBackgroundCard>
  layout: ReactElement<TLayoutBase>
  alignment: EAlignment
}

export const Popover = ({ open, onOpenChange, trigger, background, layout, alignment, playwrightTestId }: TPopover) => {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <Content align={alignTranslate(alignment)} data-playwright-testid={playwrightTestId}>
          <Composition>
            {background}

            {layout}
          </Composition>

          {/* <Arrow colorArrow={colorArrow} width={Size.Small} height={Size.Xsmall} /> */}
        </Content>
      </RadixPopover.Portal>
    </Root>
  )
}
