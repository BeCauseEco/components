import { ReactElement } from "react"
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
  contentTargetId?: string
  navigationItems: ReactElement<TTabsNavigationItem> | ReactElement<TTabsNavigationItem>[]
  contentItems: ReactElement<TTabsContentItem> | ReactElement<TTabsContentItem>[]
}

export const Tabs = ({
  defaultContentTargetId,
  contentTargetId,
  navigationItems,
  contentItems,
  playwrightTestId,
}: TTabs) => {
  return (
    <Root
      defaultValue={defaultContentTargetId}
      value={contentTargetId || defaultContentTargetId}
      data-playwright-testid={playwrightTestId}
    >
      <List>{navigationItems}</List>

      {contentItems}
    </Root>
  )
}
