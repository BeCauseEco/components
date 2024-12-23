import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableCell } from "@new/Table/TableCell"
import { PlaywrightProps } from "@new/Playwright"

type TContainerProperties = Omit<TTableRow, "children">

const Container = styled.tr<TContainerProperties>({
  display: "table-row",
})

export type TTableRow = PlaywrightProps & {
  children: ReactElement<TTableCell> | ReactElement<TTableCell>[]
}

export const TableRow = (p: TTableRow) => (
  <Container data-playwright-testid={p["data-playwright-testid"]}>{p.children}</Container>
)
