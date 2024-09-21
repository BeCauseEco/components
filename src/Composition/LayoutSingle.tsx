import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
import { TAlign } from "@new/Align/Align"
import { TComposition } from "./Composition"

type TContainerProperties = Omit<TLayoutSingle, "content">

const Container = styled.div<TContainerProperties>(p => ({
  display: "flex",
  height: "inherit",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
}))

export type TLayoutSingle = TLayoutBase & {
  children: ReactElement<TAlign | TComposition> | ReactElement<TComposition[]>
}

export const LayoutSingle = ({ children, omitPadding, playwrightTestId }: TLayoutSingle) => {
  return (
    <Container
      className="layout-container layout-single"
      omitPadding={omitPadding}
      data-playwright-testid={playwrightTestId}
    >
      {children}
    </Container>
  )
}
