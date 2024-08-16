import { EColor } from "@new/Color"
import { TInputButton } from "@new/InputButton/InputButton"
import styled from "@emotion/styled"
import * as RadixDropDownMenu from "@radix-ui/react-dropdown-menu"
import { ReactElement } from "react"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "../Composition/BackgroundCard"
import { TDropDownMenuItem } from "./DrownDownMenuItem"
import { TDropDownMenuSeparator } from "./DrownDownMenuSeparator"
import { ESize } from "@new/ESize"
import { EShadow } from "@new/EShadow"
import { LayoutDropDownMenu } from "./internal/LayoutDropDownMenu"

const Content = styled(RadixDropDownMenu.Content)({
  zIndex: 1,
  minWidth: "40rem",
})

type TDropDownMenuArrowProperties = { color: EColor }

const Arrow = styled(RadixDropDownMenu.Arrow)<TDropDownMenuArrowProperties>(p => ({
  fill: p.color,
}))

export type TDropDownMenu = {
  buttonTrigger: ReactElement<TInputButton>
  items:
    | ReactElement<TDropDownMenuItem | TDropDownMenuSeparator>
    | ReactElement<TDropDownMenuItem | TDropDownMenuSeparator>[]
  colorBackground: EColor
}

export const DropDownMenu = ({ buttonTrigger, items, colorBackground }: TDropDownMenu) => (
  <RadixDropDownMenu.Root>
    <RadixDropDownMenu.Trigger asChild>{buttonTrigger}</RadixDropDownMenu.Trigger>

    <RadixDropDownMenu.Portal>
      <Content sideOffset={4}>
        <Composition>
          <BackgroundCard colorBackground={[colorBackground, 700]} borderRadius={ESize.Tiny} shadow={EShadow.Medium} />

          <LayoutDropDownMenu content={items} />
        </Composition>

        <Arrow color={colorBackground} />
      </Content>
    </RadixDropDownMenu.Portal>
  </RadixDropDownMenu.Root>
)
