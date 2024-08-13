import styled from "@emotion/styled"
import { ReactElement } from "react"

type TContainerProperties = Omit<TTableCell, "children">

const Container = styled.td<TContainerProperties>(p => ({
  display: "table-cell",
  padding: "var(--BU) calc(var(--BU) * 4)",
  border: "solid 1px rgba(0, 0, 0, 0)",
  width: p.width || "auto",
}))

export type TTableCell = {
  children?: ReactElement | ReactElement[]
  width?: string
  columnSpan?: number
}

export const TableCell = ({ children, width, columnSpan = 1 }: TTableCell) => (
  <Container width={width} colSpan={columnSpan}>
    {children}
  </Container>
)