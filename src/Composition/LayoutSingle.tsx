import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
import { TAlign } from "@new/Align/Align"

type TContainerProperties = Omit<TLayoutSingle, "content">

const Container = styled.div<TContainerProperties>(p => ({
  display: "flex",
  padding: p.omitPadding ? 0 : "calc(var(--BU) * 4)",
  height: "inherit",
}))

export type TLayoutSingle = TLayoutBase & {
  omitPadding: boolean
  children: ReactElement<TAlign>
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
