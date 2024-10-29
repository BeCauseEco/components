import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { TAlign } from "@new/Align/Align"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { TStack } from "@new/Stack/Stack"

const Container = styled.div<Pick<TGrid, "rows" | "columns" | "collapse">>(p => ({
  display: "grid",
  gap: p.collapse ? 0 : "calc(var(--BU) * 4)",
  gridTemplateColumns: p.columns,
  gridTemplateRows: p.rows,
  height: "inherit",
}))

export type TGrid = TLayoutBase & {
  columns: "1fr" | "1fr 1fr" | "1fr 1fr 1fr" | "1fr 1fr 1fr 1fr"
  rows: "auto"
  collapse?: boolean
  children: ReactElement<TAlign | TStack> | ReactElement<TAlign | TStack>[]
}

export const Grid = ({ columns, rows, collapse, children, playwrightTestId }: PropsWithChildren<TGrid>) => {
  return (
    <Container
      className="layout-container"
      columns={columns}
      rows={rows}
      collapse={collapse}
      data-playwright-testid={playwrightTestId}
    >
      {children}
    </Container>
  )
}
