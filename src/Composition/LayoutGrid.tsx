import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"

const Container = styled.div<Pick<TLayoutGrid, "rows" | "columns">>(p => ({
  display: "grid",
  gap: "calc(var(--BU) * 4)",
  gridTemplateColumns: p.columns,
  gridTemplateRows: p.rows,
}))

export type TLayoutGrid = TLayoutBase & {
  content: ReactNode | ReactNode[]
  columns: "1fr 1fr" | "1fr 1fr 1fr" | "1fr 1fr 1fr 1fr"
  rows: "auto"
}

export const LayoutGrid = ({ columns, rows, content }: TLayoutGrid) => {
  return (
    <Container className="layout-container" columns={columns} rows={rows}>
      {content}
    </Container>
  )
}