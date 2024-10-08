import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableRow } from "@new/Table/TableRow"
import { ESize } from "@new/ESize"
import { TColor, computeColor } from "@new/Color"
import { TPlaywright } from "@new/TPlaywright"

type TContainerProperties = Omit<TTable, "head" | "body">

const Container = styled.table<TContainerProperties>(p => ({
  display: "table",
  borderCollapse: "collapse",
  outline: `solid 1px ${computeColor(p.colorBorder)}`,
  outlineOffset: -1,
  border: "solid 1px transparent",
  borderRadius: ESize.Tiny,

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

export type TTable = TPlaywright & {
  head?: ReactElement<TTableRow>
  body: ReactElement<TTableRow> | ReactElement<TTableRow>[]
  colorBorder: TColor
  colorCellSeparator: TColor
  colorRowHover: TColor
}

export const Table = ({ head, body, colorBorder, colorCellSeparator, colorRowHover, playwrightTestId }: TTable) => (
  <Container
    colorBorder={colorBorder}
    colorCellSeparator={colorCellSeparator}
    colorRowHover={colorRowHover}
    data-playwright-testid={playwrightTestId}
  >
    <Head>{head}</Head>

    <Body>{body}</Body>
  </Container>
)
