import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableRow } from "@new/Table/TableRow"
import { Size } from "@new/Size"
import { ColorWithLightness, computeColor } from "@new/Color"
import { PlaywrightProps } from "@new/Playwright"

type TContainerProperties = Omit<TTable, "head" | "body">

const Container = styled.table<TContainerProperties>(p => ({
  display: "table",
  borderCollapse: "collapse",
  outline: `solid 1px ${computeColor(p.colorBorder)}`,
  outlineOffset: -1,
  border: "solid 1px transparent",
  borderRadius: Size.Tiny,
  width: "100%",

  "& thead td": {
    borderBottom: `solid 1px ${computeColor(p.colorBorder)}`,
  },

  "& tr:not(:last-child) td": {
    borderBottom: `solid 1px ${computeColor(p.colorBorder)}`,
  },

  "& td": {
    border: `dotted 1px ${computeColor(p.colorCellSeparator)}`,
    height: "calc(var(--BU) * 10)",
  },

  "& tbody tr:hover": {
    backgroundColor: computeColor(p.colorRowHover),
  },
}))

const Head = styled.thead({
  display: "table-header-group",
})

const Body = styled.tbody({
  display: "table-row-group",
})

export type TTable = PlaywrightProps & {
  head?: ReactElement<TTableRow>
  body: ReactElement<TTableRow> | ReactElement<TTableRow>[]
  colorBorder: ColorWithLightness
  colorCellSeparator: ColorWithLightness
  colorRowHover: ColorWithLightness
}

export const Table = (p: TTable) => (
  <Container
    colorBorder={p.colorBorder}
    colorCellSeparator={p.colorCellSeparator}
    colorRowHover={p.colorRowHover}
    data-playwright-testid={p["data-playwright-testid"]}
  >
    <Head>{p.head}</Head>

    <Body>{p.body}</Body>
  </Container>
)
