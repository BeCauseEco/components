import { PropsWithChildren, ReactElement } from "react"
import { TInputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { Icon } from "@new/Icon/Icon"
import { EColor } from "@new/Color"
import React from "react"
import { Composition } from "@new/Composition/Composition"
import { LayoutBreadcrumb } from "./internal/LayoutBreadcrumb"
import { TText } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"

export type TBreadcrumb = TPlaywright & {
  color: EColor
  omitPadding?: boolean
  children: ReactElement<TInputButtonPrimary | TText> | ReactElement<TInputButtonPrimary | TText>[]
}

export const Breadcrumb = ({ color, omitPadding, children, playwrightTestId }: PropsWithChildren<TBreadcrumb>) => {
  const items: ReactElement[] = []

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      items.push(child)

      items.push(<Icon name="chevron_forward" medium fill={[color, 700]} key={index} />)
    }
  })

  items.pop()

  // TO-DO: @cllpse: a little hacky, but stops content shift.
  items.push(<Icon name="chevron_forward" medium fill={[EColor.Transparent]} key={items.length} />)

  return (
    <Composition playwrightTestId={playwrightTestId}>
      <LayoutBreadcrumb omitPadding={omitPadding}>{items}</LayoutBreadcrumb>
    </Composition>
  )
}
