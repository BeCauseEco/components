import styled from "@emotion/styled"
import { Playwright } from "@new/Playwright"
import { ReactElement } from "react"

type TContainerProperties = Omit<TTableCell, "children">

const Container = styled.td<TContainerProperties>(p => ({
  display: "table-cell",
  padding: p.omitPadding ? 0 : "var(--BU) calc(var(--BU) * 4)",
  border: "solid 1px rgba(0, 0, 0, 0)",
  width: p.width || "auto",
}))

export type TTableCell = Playwright & {
  children?: ReactElement | ReactElement[]
  width?: string
  omitPadding?: boolean
  columnSpan?: number
}

export const TableCell = ({ children, width, omitPadding, columnSpan = 1, playwrightTestId }: TTableCell) => (
  <Container width={width} colSpan={columnSpan} omitPadding={omitPadding} data-playwright-testid={playwrightTestId}>
    {children}
  </Container>
)
