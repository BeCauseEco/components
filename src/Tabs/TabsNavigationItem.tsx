import { TIcon } from "@new/Icon/Icon"
import { TSpacer } from "@new/Spacer/Spacer"
import { TText } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { TPlaywright } from "@new/TPlaywright"

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

export type TTabsNavigationItem = TPlaywright & {
  contentTargetId: string
  children: ReactElement<TIcon | TText | TSpacer> | ReactElement<TIcon | TText | TSpacer>[]
}

export const TabsNavigationItem = forwardRef<
  Tabs.TabsTriggerProps & RefAttributes<HTMLButtonElement>,
  PropsWithChildren<TTabsNavigationItem>
>((props, ref) => {
  const { contentTargetId, children, playwrightTestId } = props

  return (
    <Trigger
      key={`tabstrigger${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={playwrightTestId}
      {...(props as any)}
      asChild
    >
      {children}
    </Trigger>
  )
})
