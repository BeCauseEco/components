import { PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"
import { StackProps } from "@new/Stack/Stack"
import { ComponentBaseProps } from "@new/ComponentBaseProps"

const computeGridTemplateColumns = (columns: GridProps["columns"]): string => {
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

const Container = styled.div<Pick<GridProps, "columns" | "hug">>(p => ({
  display: "grid",
  gap: p.hug ? 0 : "calc(var(--BU) * 4)",
  gridTemplateColumns: computeGridTemplateColumns(p.columns),
  gridTemplateRows: "auto",
  height: "inherit",
}))

export type GridProps = ComponentBaseProps & {
  columns: "two" | "three" | "four"

  hug?: boolean

  children: ReactElement<StackProps> | ReactElement<StackProps>[]
}

export const Grid = (p: PropsWithChildren<GridProps>) => {
  return (
    <Container
      className="<Grid /> - layout-container"
      columns={p.columns}
      hug={p.hug}
      data-playwright-testid={p.playwrightTestId}
    >
      {p.children}
    </Container>
  )
}
