import styled from "@emotion/styled"
import React, { ReactElement } from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { keyframes } from "@emotion/react"
// import { EColor, computeColor } from "@new/Color"
// import { ESize } from "@new/ESize"
import { EAlignment } from "@new/EAlignment"
import { TBackgroundCard } from "@new/Composition/BackgroundCard"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { Composition } from "@new/Composition/Composition"

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

const Content = styled(RadixPopover.Content)<Pick<TPopover, "overflowBehavior">>(p => ({
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  zIndex: 1001, // zIndex of 1001 is needed to be used in modal context

  ...(p.overflowBehavior === EPopoverOverflowBehavior.OverflowScroll && {
    maxHeight: "var(--radix-popover-content-available-height)",

    overflowY: "auto",

    scrollBehavior: "smooth",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.1)",

    "&::-webkit-scrollbar": {
      width: "11px",
    },

    "::-webkit-scrollbar-track": {
      background: "rgba(0, 0, 0, 0.1)",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "6px",
      border: "3px solid rgba(0, 0, 0, 0.1)",
    },
  }),

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
}))

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

export enum EPopoverOverflowBehavior {
  /** Allow for scrolling when content overflows */
  OverflowScroll,

  /** Hide overflowing content (primarily used by components which handles overflow themselves) */
  OverflowHidden,
}

export type TPopover = {
  // colorArrow: EColor
  open?: boolean
  onOpenChange?: (value: boolean) => void
  trigger: ReactElement
  background: ReactElement<TBackgroundCard>
  layout: ReactElement<TLayoutBase>
  overflowBehavior: EPopoverOverflowBehavior
  alignment: EAlignment
}

export const Popover = ({ open, onOpenChange, trigger, background, layout, overflowBehavior, alignment }: TPopover) => {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <Content align={alignTranslate(alignment)} overflowBehavior={overflowBehavior}>
          <Composition>
            {background}

            {layout}
          </Composition>

          {/* <Arrow colorArrow={colorArrow} width={ESize.Small} height={ESize.Xsmall} /> */}
        </Content>
      </RadixPopover.Portal>
    </Root>
  )
}
