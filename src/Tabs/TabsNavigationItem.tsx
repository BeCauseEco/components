import { IconProps } from "@new/Icon/Icon"
import { SpacerProps } from "@new/Stack/Spacer"
import { TextProps } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, forwardRef } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { Color, computeColor } from "@new/Color"

const Trigger = styled(Tabs.Trigger)({
  display: "flex",
  flexDirection: "row",
  userSelect: "none",
  cursor: "pointer",
  height: "calc(var(--BU) * 12)",
  padding: "0 calc(var(--BU) * 4)",
  alignItems: "center",

  "& > p": {
    lineHeight: "inherit",
  },

  "&[data-state='active']": {
    boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },

  "&[disabled]": {
    cursor: "not-allowed",
    color: computeColor([Color.Neutral, 200]),
  },
})

export type TTabsNavigationItem = PlaywrightProps & {
  contentTargetId: string
  children: ReactElement<IconProps | TextProps | SpacerProps> | ReactElement<IconProps | TextProps | SpacerProps>[]
  onClick?: () => void
  disabled?: boolean
}

export const TabsNavigationItem = forwardRef<HTMLButtonElement, PropsWithChildren<TTabsNavigationItem>>((p, ref) => {
  const { contentTargetId, children, onClick, disabled, ...rest } = p

  return (
    <Trigger
      key={`tabstrigger${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={p["data-playwright-testid"]}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      asChild
    >
      {children}
    </Trigger>
  )
})
