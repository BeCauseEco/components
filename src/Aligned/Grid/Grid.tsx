import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { TStack } from "@new/Aligned/Stack/Stack"

const computeGridTemplateColumns = (columns: TGrid["columns"]): string => {
  switch (columns) {
    case "two":
      return "1fr 1fr"

    case "three":
      return "1fr 1fr 1fr"

    case "four":
      return "1fr 1fr 1fr 1fr"

    default:
      return "1fr"
  }
}

const Container = styled.div<Pick<TGrid, "columns" | "hug">>(p => ({
  display: "grid",
  gap: p.hug ? 0 : "calc(var(--BU) * 4)",
  gridTemplateColumns: computeGridTemplateColumns(p.columns),
  gridTemplateRows: "auto",
  height: "inherit",
}))

export type TGrid = TLayoutBase & {
  columns: "two" | "three" | "four"

  hug?: boolean

  children: ReactElement<TStack> | ReactElement<TStack>[]
}

export const Grid = (p: PropsWithChildren<TGrid>) => {
  return (
    <Container className="layout-container" columns={p.columns} hug={p.hug} data-playwright-testid={p.playwrightTestId}>
      {p.children}
    </Container>
  )
}
