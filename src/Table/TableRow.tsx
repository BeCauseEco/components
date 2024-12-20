import styled from "@emotion/styled"
import { ReactElement } from "react"
import { TTableCell } from "@new/Table/TableCell"
import { PlaywrightProps } from "@new/Playwright"

type TContainerProperties = Omit<TTableRow, "children">

const Container = styled.tr<TContainerProperties>({
  display: "table-row",
})

export type TTableRow = PlaywrightProps & {
  children: ReactElement<TTableCell> | ReactElement<TTableCell>[]
}

export const TableRow = ({ children, playwrightTestId }: TTableRow) => (
  <Container data-playwright-testid={playwrightTestId}>{children}</Container>
)
