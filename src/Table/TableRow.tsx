import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableCell } from "@new/Table/TableCell"
import { TPlaywright } from "@new/TPlaywright"

type TContainerProperties = Omit<TTableRow, "children">

const Container = styled.tr<TContainerProperties>({
  display: "table-row",
})

export type TTableRow = TPlaywright & {
  children: ReactElement<TTableCell> | ReactElement<TTableCell>[]
}

export const TableRow = ({ children, playwrightTestId }: TTableRow) => (
  <Container data-playwright-testid={playwrightTestId}>{children}</Container>
)
