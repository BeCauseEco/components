import styled from "@emotion/styled"
import { EColor, computeColor } from "@new/Color"
import * as DropDownMenu from "@radix-ui/react-dropdown-menu"

const Container = styled(DropDownMenu.Separator)<TDropDownMenuSeparator>(p => ({
  display: "flex",
  width: "calc(100% + 4rem)",
  height: "1px",
  marginTop: "2rem",
  marginBottom: "2rem",
  backgroundColor: computeColor([p.color, 50]),
  transform: "translateX(-2rem)",
}))

export type TDropDownMenuSeparator = {
  color: EColor
}

export const DropDownMenuSeparator = ({ color }: TDropDownMenuSeparator) => <Container color={color} />
