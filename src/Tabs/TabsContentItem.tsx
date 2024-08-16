import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { TComposition } from "@new/Composition/Composition"
import styled from "@emotion/styled"

const TabsContent = styled(Tabs.Content)({
  display: "flex",
  flexDirection: "column",
  paddingTop: "calc(var(--BU) * 4)",
  outline: "solid 2px red",
  outlineOffset: "-1px",
})

export type TTabsContentItem = {
  contentTargetId: string
  children: ReactElement<TComposition>
}

export const TabsContentItem = forwardRef<
  Tabs.TabsContentProps & RefAttributes<HTMLDivElement>,
  PropsWithChildren<TTabsContentItem>
>((props, ref) => {
  const { contentTargetId, children } = props

  return (
    <TabsContent key={`tabscontent${contentTargetId}`} ref={ref} value={contentTargetId} {...(props as any)} asChild>
      {children}
    </TabsContent>
  )
})
