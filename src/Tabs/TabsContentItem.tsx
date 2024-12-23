import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { TComposition } from "@new/Composition/Composition"
import { Spacer } from "@new/Stack/Spacer"
import { PlaywrightProps } from "@new/Playwright"
import styled from "@emotion/styled"

export type TTabsContentItem = PlaywrightProps & {
  contentTargetId: string
  children: ReactElement<TComposition>
}

const TabsContent = styled(Tabs.Content)({
  width: "inherit",
})

export const TabsContentItem = forwardRef<
  Tabs.TabsContentProps & RefAttributes<HTMLDivElement>,
  PropsWithChildren<TTabsContentItem>
>((p, ref) => {
  const { contentTargetId, children } = p

  return (
    <TabsContent
      key={`tabscontent${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={p["data-playwright-testid"]}
      {...(p as any)}
      asChild
    >
      <>
        <Spacer large />

        {children}
      </>
    </TabsContent>
  )
})
