import styled from "@emotion/styled"
import { EColor, computeColor } from "@new/Color"
import { ESize } from "@new/ESize"
import { Text } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"
import * as DropDownMenu from "@radix-ui/react-dropdown-menu"

type TProperties = Omit<TDropDownMenuItem, "label">

const Item = styled(DropDownMenu.Item)<TProperties>(p => ({
  display: "flex",
  cursor: "pointer",
  backgroundColor: computeColor([p.colorBackground, 700]),
  padding: "1rem 2rem",
  borderRadius: ESize.Tiny,

  "&[data-highlighted]": {
    backgroundColor: computeColor([p.colorHighlightBackground, 700]),
  },

  "&[data-highlighted] p": {
    color: computeColor([p.colorHighlightForeground, 700]),
  },
}))

export type TDropDownMenuItem = TPlaywright & {
  label: string
  colorBackground: EColor
  colorForeground: EColor
  colorHighlightBackground: EColor
  colorHighlightForeground: EColor
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
    <Text size={ESize.Medium} color={[colorForeground, 700]}>
      {label}
    </Text>
  </Item>
)
