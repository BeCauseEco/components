import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
import { AlignProps } from "@new/Stack/Align"

const Container = styled.div<Pick<TLayoutGrid, "rows" | "columns">>(p => ({
  display: "grid",
  gap: "calc(var(--BU) * 4)",
  gridTemplateColumns: p.columns,
  gridTemplateRows: p.rows,
  height: "inherit",
}))

export type TLayoutGrid = TLayoutBase & {
  columns: "1fr" | "1fr 1fr" | "1fr 1fr 1fr" | "1fr 1fr 1fr 1fr"
  rows: "auto"
  children: ReactElement<AlignProps>[]
}

export const LayoutGrid = (p: PropsWithChildren<TLayoutGrid>) => {
  return (
    <Container
      className="layout-container"
      columns={p.columns}
      rows={p.rows}
      data-playwright-testid={p["data-playwright-testid"]}
    >
      {p.children}
    </Container>
  )
}
