import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableCell } from "@new/Table/TableCell"

type TContainerProperties = Omit<TTableRow, "children">

const Container = styled.tr<TContainerProperties>({
  display: "table-row",
})

export type TTableRow = {
  children: ReactElement<TTableCell> | ReactElement<TTableCell>[]
}

export const TableRow = ({ children }: TTableRow) => <Container>{children}</Container>
