import * as Tabs from "@radix-ui/react-tabs"
import { PropsWithChildren, ReactElement, RefAttributes, forwardRef } from "react"
import { TComposition } from "@new/Composition/Composition"
import { Spacer } from "@new/Stack/Spacer"
import { PlaywrightProps } from "@new/Playwright"

export type TTabsContentItem = PlaywrightProps & {
  contentTargetId: string
  children: ReactElement<TComposition>
}

export const TabsContentItem = forwardRef<
  Tabs.TabsContentProps & RefAttributes<HTMLDivElement>,
  PropsWithChildren<TTabsContentItem>
>((props, ref) => {
  const { contentTargetId, children, playwrightTestId } = props

  return (
    <Tabs.Content
      key={`tabscontent${contentTargetId}`}
      ref={ref}
      value={contentTargetId}
      data-playwright-testid={playwrightTestId}
      {...(props as any)}
      asChild
    >
      <>
        <Spacer large />

        {children}
      </>
    </Tabs.Content>
  )
})
