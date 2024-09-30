import { PropsWithChildren, ReactNode } from "react"
import { TInputButton } from "@new/InputButton/InputButton"
import { Icon } from "@new/Icon/Icon"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import React from "react"
import { Composition } from "@new/Composition/Composition"
import { LayoutBreadcrumb } from "./internal/LayoutBreadcrumb"
import { TText } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"

export type TBreadcrumb = TPlaywright & {
  color: EColor
  omitPadding?: boolean
  children: ReactNode<TInputButton | TText> | ReactNode<TInputButton | TText>[]
}

export const Breadcrumb = ({ color, omitPadding, children, playwrightTestId }: PropsWithChildren<TBreadcrumb>) => {
  const items: ReactNode[] = []

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      items.push(child)

      items.push(<Icon name="chevron_forward" size={ESize.Medium} color={[color, 700]} />)
    }
  })

  items.pop()

  // TO-DO: @cllpse: a little hacky, but stops content shift.
  items.push(<Icon name="chevron_forward" size={ESize.Medium} color={[EColor.Transparent]} />)

  return (
    <Composition playwrightTestId={playwrightTestId}>
      <LayoutBreadcrumb omitPadding={omitPadding}>{items}</LayoutBreadcrumb>
    </Composition>
  )
}
