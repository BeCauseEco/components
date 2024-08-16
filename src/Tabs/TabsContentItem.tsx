import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { TComposition } from "@new/Composition/Composition"
import { ESize } from "@new/ESize"
import { Spacer } from "@new/Spacer/Spacer"

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
    <Tabs.Content key={`tabscontent${contentTargetId}`} ref={ref} value={contentTargetId} {...(props as any)} asChild>
      <>
        <Spacer size={ESize.Small} />

        {children}
      </>
    </Tabs.Content>
  )
})
