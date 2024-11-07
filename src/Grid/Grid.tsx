import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { TStack } from "@new/Stack/Stack"

const Container = styled.div<Pick<TGrid, "rows" | "columns" | "hug">>(p => ({
  display: "grid",
  gap: p.hug ? 0 : "calc(var(--BU) * 4)",
  gridTemplateColumns: p.columns,
  gridTemplateRows: p.rows,
  height: "inherit",
}))

export type TGrid = TLayoutBase & {
  columns: "1fr" | "1fr 1fr" | "1fr 1fr 1fr" | "1fr 1fr 1fr 1fr"
  rows: "auto"
  hug?: boolean
  children: ReactElement<TStack> | ReactElement<TStack>[]
}

export const Grid = ({ columns, rows, hug, children, playwrightTestId }: PropsWithChildren<TGrid>) => {
  return (
    <Container
      className="layout-container"
      columns={columns}
      rows={rows}
      hug={hug}
      data-playwright-testid={playwrightTestId}
    >
      {children}
    </Container>
  )
}
