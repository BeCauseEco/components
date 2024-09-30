import { ReactNode } from "react"
import styled from "@emotion/styled"
import { ESize } from "@new/ESize"

const computeAlignment = (
  column = false,
  row = false,
  start = false,
  center = false,
  end = false,
  top = false,
  middle = false,
  bottom = false,
) => {
  const r = {
    justifyContent: "normal",
    alignContent: "normal",
    alignItems: "normal",
  }

  if (column) {
    if (start) {
      r.justifyContent = "flex-start"
    }

    if (center) {
      r.alignContent = "center"
      r.alignItems = "center"
    }

    if (end) {
      r.alignContent = "flex-end"
      r.alignItems = "flex-end"
    }

    if (top) {
      r.justifyContent = "flex-start"
    }

    if (middle) {
      r.justifyContent = "center"
    }

    if (bottom) {
      r.justifyContent = "flex-end"
    }
  } else if (row) {
    if (start) {
      r.justifyContent = "flex-start"
    }

    if (center) {
      r.justifyContent = "center"
    }

    if (end) {
      r.justifyContent = "flex-end"
    }

    if (top) {
      r.alignContent = "flex-start"
      r.alignItems = "flex-start"
    }

    if (middle) {
      r.alignContent = "center"
      r.alignItems = "center"
    }

    if (bottom) {
      r.alignContent = "flex-end"
      r.alignItems = "flex-end"
    }
  }

  return r
}

const Container = styled.div<TAlign>(p => ({
  display: "flex",
  flexWrap: "inherit",
  // @ts-expect-error TypeScript is not smart enough to accept discriminating unions in this case
  flexDirection: p.column ? "column" : "row",
  width: "100%",
  height: "100%",
  // @ts-expect-error see first ignore
  ...computeAlignment(p.column, p.row, p.start, p.center, p.end, p.top, p.middle, p.bottom),
  gap: p.spacing || 0,
}))

type TAlignBase = {
  spacing?: ESize

  /** Horizontal axis, align start  */
  start?: boolean

  /** Horizontal axis, align center  */
  center?: boolean

  /** Horizontal axis, align end  */
  end?: boolean

  /** Vertical axis, align top  */
  top?: boolean

  /** Vertical axis, align middle  */
  middle?: boolean

  /** Vertical axis, align bottom  */
  bottom?: boolean

  children: ReactNode | ReactNode[]
}

type TAlign =
  | (TAlignBase & {
      /** Set flex-direction to "column" */
      column: boolean
    })
  | (TAlignBase & {
      /** Set flex-direction to "row" */
      row: boolean
    })

export const Align = ({
  // @ts-expect-error see first ignore
  column,
  // @ts-expect-error see first ignore
  row,
  spacing,
  start = false,
  center = false,
  end = false,
  top = false,
  middle = false,
  bottom = false,
  children,
}: TAlign) => (
  <Container
    column={column}
    row={row}
    start={start}
    center={center}
    end={end}
    top={top}
    middle={middle}
    bottom={bottom}
    spacing={spacing}
  >
    {children}
  </Container>
)
