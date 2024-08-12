import { ReactElement } from "react"
import * as RadixTabs from "@radix-ui/react-tabs"
import { TTabsNavigationItem } from "@new/Tabs/TabsNavigationItem"
import { TTabsContentItem } from "@new/Tabs/TabsContentItem"
import styled from "@emotion/styled"

const Root = styled(RadixTabs.Root)({
  display: "flex",
  flexDirection: "column",
})

const List = styled(RadixTabs.List)({
  display: "flex",
  flexDirection: "row",
})

export type TTabs = {
  defaultContentTargetId: string
  navigationItems: ReactElement<TTabsNavigationItem> | ReactElement<TTabsNavigationItem>[]
  contentItems: ReactElement<TTabsContentItem> | ReactElement<TTabsContentItem>[]
}

export const Tabs = ({ defaultContentTargetId, navigationItems, contentItems }: TTabs) => {
  return (
    <Root defaultValue={defaultContentTargetId}>
      <List>{navigationItems}</List>

      {contentItems}
    </Root>
  )
}
