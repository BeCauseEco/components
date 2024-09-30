import { ReactNode } from "react"
import * as RadixTabs from "@radix-ui/react-tabs"
import { TTabsNavigationItem } from "@new/Tabs/TabsNavigationItem"
import { TTabsContentItem } from "@new/Tabs/TabsContentItem"
import styled from "@emotion/styled"
import { computeColor, EColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

const Root = styled(RadixTabs.Root)({
  display: "flex",
  flexDirection: "column",
  height: "inherit",
})

const List = styled(RadixTabs.List)({
  display: "flex",
  flexDirection: "row",
  borderBottom: `solid 1px ${computeColor([EColor.Black, 100])}`,
})

export type TTabs = TPlaywright & {
  defaultContentTargetId: string
  navigationItems: ReactNode<TTabsNavigationItem> | ReactNode<TTabsNavigationItem>[]
  contentItems: ReactNode<TTabsContentItem> | ReactNode<TTabsContentItem>[]
}

export const Tabs = ({ defaultContentTargetId, navigationItems, contentItems, playwrightTestId }: TTabs) => {
  return (
    <Root defaultValue={defaultContentTargetId} data-playwright-testid={playwrightTestId}>
      <List>{navigationItems}</List>

      {contentItems}
    </Root>
  )
}
