import { ReactElement } from "react"
import * as RadixTabs from "@radix-ui/react-tabs"
import { TTabsNavigationItem } from "@new/Tabs/TabsNavigationItem"
import { TTabsContentItem } from "@new/Tabs/TabsContentItem"
import styled from "@emotion/styled"
import { computeColor, Color } from "@new/Color"
import { PlaywrightProps } from "@new/Playwright"

const Root = styled(RadixTabs.Root)({
  display: "flex",
  flexDirection: "column",
  height: "inherit",
})

const List = styled(RadixTabs.List)({
  display: "flex",
  flexDirection: "row",
  borderBottom: `solid 1px ${computeColor([Color.Neutral, 100])}`,
})

export type TTabs = PlaywrightProps & {
  contentTargetId?: string
  defaultContentTargetId: string
  navigationItems: ReactElement<TTabsNavigationItem> | ReactElement<TTabsNavigationItem>[]
  contentItems: ReactElement<TTabsContentItem> | ReactElement<TTabsContentItem>[]
}

export const Tabs = ({
  contentTargetId,
  defaultContentTargetId,
  navigationItems,
  contentItems,
  playwrightTestId,
}: TTabs) => {
  return (
    <Root value={contentTargetId} defaultValue={defaultContentTargetId} data-playwright-testid={playwrightTestId}>
      <List>{navigationItems}</List>

      {contentItems}
    </Root>
  )
}
