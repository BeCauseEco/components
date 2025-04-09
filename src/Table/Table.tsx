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
  width: p.hug ? "0" : "100%",

  "& thead td": {
    borderBottom: `solid 1px ${computeColor(p.colorBorder)}`,
  },

  "& tr:not(:last-child) td": {
    borderBottom: `solid 1px ${computeColor(p.colorBorder)}`,
  },

  "& td": {
    border: `dotted 1px ${computeColor(p.colorCellSeparator)}`,
    height: p.hug ? "0  !important" : "calc(var(--BU) * 10)",
    ...(p.hug && { padding: "calc(var(--BU) / 2) calc(var(--BU) * 2) !important" }),
  },

  "& td:first-child": {
    ...(p.hug && { paddingLeft: "0 !important" }),
  },

  "& td:last-child": {
    ...(p.hug && { paddingRight: "0 !important" }),
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
  hug?: boolean
}

export const Table = (p: TTable) => (
  <Container
    colorBorder={p.colorBorder}
    colorCellSeparator={p.colorCellSeparator}
    colorRowHover={p.colorRowHover}
    data-playwright-testid={p["data-playwright-testid"]}
    hug={p.hug}
  >
    <Head>{p.head}</Head>

    <Body>{p.body}</Body>
  </Container>
)
