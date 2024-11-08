import { Color } from "@new/Color"
import { TInputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import styled from "@emotion/styled"
import * as RadixDropDownMenu from "@radix-ui/react-dropdown-menu"
import { ReactElement } from "react"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "../Composition/BackgroundCard"
import { TDropDownMenuItem } from "./DrownDownMenuItem"
import { TDropDownMenuSeparator } from "./DrownDownMenuSeparator"
import { Size } from "@new/Size"
import { EShadow } from "@new/EShadow"
import { LayoutDropDownMenu } from "./internal/LayoutDropDownMenu"
import { TPlaywright } from "@new/TPlaywright"

const Content = styled(RadixDropDownMenu.Content)({
  zIndex: 1,
  minWidth: "40rem",
})

type TDropDownMenuArrowProperties = { color: Color }

const Arrow = styled(RadixDropDownMenu.Arrow)<TDropDownMenuArrowProperties>(p => ({
  fill: p.color,
}))

export type TDropDownMenu = TPlaywright & {
  buttonTrigger: ReactElement<TInputButtonPrimary>
  items:
    | ReactElement<TDropDownMenuItem | TDropDownMenuSeparator>
    | ReactElement<TDropDownMenuItem | TDropDownMenuSeparator>[]
  colorBackground: Color
}

export const DropDownMenu = ({ buttonTrigger, items, colorBackground, playwrightTestId }: TDropDownMenu) => (
  <RadixDropDownMenu.Root>
    <RadixDropDownMenu.Trigger asChild>{buttonTrigger}</RadixDropDownMenu.Trigger>

    <RadixDropDownMenu.Portal>
      <Content sideOffset={4} data-playwright-testid={playwrightTestId}>
        <Composition>
          <BackgroundCard colorBackground={[colorBackground, 700]} borderRadius={Size.Tiny} shadow={EShadow.Medium} />

          <LayoutDropDownMenu content={items} />
        </Composition>

        <Arrow color={colorBackground} />
      </Content>
    </RadixDropDownMenu.Portal>
  </RadixDropDownMenu.Root>
)
