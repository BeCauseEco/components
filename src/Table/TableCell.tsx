import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"
import { ReactElement } from "react"

type TContainerProperties = Omit<TTableCell, "children">

const Container = styled.td<TContainerProperties>(p => ({
  display: "table-cell",
  padding: p.omitPadding ? 0 : "var(--BU) calc(var(--BU) * 4)",
  border: "solid 1px rgba(0, 0, 0, 0)",
  width: p.width || "auto",
}))

export type TTableCell = PlaywrightProps & {
  children?: ReactElement | ReactElement[]
  width?: string
  omitPadding?: boolean
  columnSpan?: number
}

export const TableCell = (p: TTableCell) => (
  <Container
    width={p.width || "auto"}
    colSpan={p.columnSpan || 1}
    omitPadding={p.omitPadding}
    data-playwright-testid={p["data-playwright-testid"]}
  >
    {p.children}
  </Container>
)
