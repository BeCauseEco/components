import { PropsWithChildren, ReactElement } from "react"
import { TInputButton } from "@new/InputButton/InputButton"
import { Icon } from "@new/Icon/Icon"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import React from "react"
import { Composition } from "@new/Composition/Composition"
import { LayoutBreadcrumb } from "./internal/LayoutBreadcrumb"
import { TText } from "@new/Text/Text"

export type TBreadcrumb = {
  omitPadding?: boolean
  children: ReactElement<TInputButton | TText> | ReactElement<TInputButton | TText>[]
}

export const Breadcrumb = ({ omitPadding, children }: PropsWithChildren<TBreadcrumb>) => {
  const items: ReactElement[] = []

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      items.push(child)

      items.push(<Icon name="chevron_forward" size={ESize.Medium} color={[EColor.Black, 700]} />)
    }
  })

  items.pop()

  // TO-DO: @cllpse: a little hacky, but stops content shift.
  items.push(<Icon name="chevron_forward" size={ESize.Medium} color={[EColor.Transparent]} />)

  return (
    <Composition>
      <LayoutBreadcrumb omitPadding={omitPadding}>{items}</LayoutBreadcrumb>
    </Composition>
  )
}
