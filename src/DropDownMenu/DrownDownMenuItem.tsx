import styled from "@emotion/styled"
import { Color, computeColor } from "@new/Color"
import { Size } from "@new/Size"
import { Text } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"
import * as DropDownMenu from "@radix-ui/react-dropdown-menu"

type TProperties = Omit<TDropDownMenuItem, "label">

const Item = styled(DropDownMenu.Item)<TProperties>(p => ({
  display: "flex",
  cursor: "pointer",
  backgroundColor: computeColor([p.colorBackground, 700]),
  padding: "1rem 2rem",
  borderRadius: Size.Tiny,

  "&[data-highlighted]": {
    backgroundColor: computeColor([p.colorHighlightBackground, 700]),
  },

  "&[data-highlighted] p": {
    color: computeColor([p.colorHighlightForeground, 700]),
  },
}))

export type TDropDownMenuItem = TPlaywright & {
  label: string
  colorBackground: Color
  colorForeground: Color
  colorHighlightBackground: Color
  colorHighlightForeground: Color
}

export const DropDownMenuItem = ({
  label,
  colorBackground,
  colorForeground,
  colorHighlightBackground,
  colorHighlightForeground,
  playwrightTestId,
}: TDropDownMenuItem) => (
  <Item
    colorBackground={colorBackground}
    colorForeground={colorForeground}
    colorHighlightBackground={colorHighlightBackground}
    colorHighlightForeground={colorHighlightForeground}
    data-playwright-testid={playwrightTestId}
  >
    <Text size="medium" color={[colorForeground, 700]}>
      {label}
    </Text>
  </Item>
)
