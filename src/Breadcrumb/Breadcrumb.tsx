import { PropsWithChildren, ReactElement } from "react"
import { InputButtonLinkProps } from "@new/InputButton/InputButtonLink"
import { Icon } from "@new/Icon/Icon"
import { Color } from "@new/Color"
import React from "react"
import { Composition } from "@new/Composition/Composition"
import { LayoutBreadcrumb } from "./internal/LayoutBreadcrumb"
import { TextProps } from "@new/Text/Text"
import { PlaywrightProps } from "@new/Playwright"

export type TBreadcrumb = PlaywrightProps & {
  color: Color
  omitPadding?: boolean
  children: ReactElement<InputButtonLinkProps | TextProps> | ReactElement<InputButtonLinkProps | TextProps>[]
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
  items.push(<Icon name="chevron_forward" medium fill={[Color.Transparent]} key={items.length} />)

  return (
    <Composition playwrightTestId={playwrightTestId}>
      <LayoutBreadcrumb omitPadding={omitPadding}>{items}</LayoutBreadcrumb>
    </Composition>
  )
}
