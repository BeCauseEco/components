import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, forwardRef } from "react"
import { TComposition } from "@new/Composition/Composition"
import { Spacer } from "@new/Stack/Spacer"
import { PlaywrightProps } from "@new/Playwright"
import styled from "@emotion/styled"

export type TTabsContentItem = PlaywrightProps & {
  contentTargetId: string
  children: ReactElement<TComposition>
  forceMount?: boolean
}

const TabsContent = styled(Tabs.Content)({
  width: "inherit",
})

export const TabsContentItem = forwardRef<HTMLDivElement, PropsWithChildren<TTabsContentItem>>((p, ref) => {
  const { contentTargetId, children, forceMount, ...rest } = p

  return (
    <TabsContent
      key={`tabscontent${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={p["data-playwright-testid"]}
      forceMount={forceMount === true ? true : undefined}
      {...rest}
      asChild
    >
      <div>
        <Spacer large />

        {children}
      </div>
    </TabsContent>
  )
})
