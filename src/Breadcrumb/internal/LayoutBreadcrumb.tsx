import { PropsWithChildren } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div<TLayoutBreadcrumb>(p => ({
  display: "flex",
  flexDirection: "row",
  padding: p.omitPadding ? "auto" : "0 calc(var(--BU) * 2)",
  alignItems: "center",

  "& button > div, & a > div": {
    padding: "0",
  },

  "& i": {
    marginLeft: "calc(var(--BU) * 1.5)",
    marginRight: "calc(var(--BU) * 1)",
  },
}))

export type TLayoutBreadcrumb = TLayoutBase & { omitPadding?: boolean }

export const LayoutBreadcrumb = ({ omitPadding, children }: PropsWithChildren<TLayoutBreadcrumb>) => {
  return <Container omitPadding={omitPadding}>{children}</Container>
}
