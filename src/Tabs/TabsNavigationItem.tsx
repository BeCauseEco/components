import { IconProps } from "@new/Icon/Icon"
import { SpacerProps } from "@new/Stack/Spacer"
import { TextProps } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { PlaywrightProps } from "@new/Playwright"

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
})

export type TTabsNavigationItem = PlaywrightProps & {
  contentTargetId: string
  children: ReactElement<IconProps | TextProps | SpacerProps> | ReactElement<IconProps | TextProps | SpacerProps>[]
  onClick?: () => void
}

export const TabsNavigationItem = forwardRef<
  Tabs.TabsTriggerProps & RefAttributes<HTMLButtonElement>,
  PropsWithChildren<TTabsNavigationItem>
>((p, ref) => {
  const { contentTargetId, children, onClick } = p

  return (
    <Trigger
      key={`tabstrigger${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={p["data-playwright-testid"]}
      onClick={onClick}
      {...(p as any)}
      asChild
    >
      {children}
    </Trigger>
  )
})
