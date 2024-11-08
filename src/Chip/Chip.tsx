import { PropsWithChildren, ReactElement } from "react"
import { TextProps } from "@new/Text/Text"
import { ColorLightness } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutChip } from "./internal/LayoutChip"
import { Composition } from "@new/Composition/Composition"
import { Size } from "@new/Size"
import styled from "@emotion/styled"
import { Playwright } from "@new/Playwright"
import { TIcon } from "@new/Icon/Icon"
import { TSpacer } from "@new/Spacer/Spacer"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"

const Container = styled.div({
  display: "flex",
  width: "fit-content",
  cursor: "inherit",
})

export type TChip = Playwright & {
  colorBackground?: ColorLightness
  colorOutline?: ColorLightness
  children:
    | ReactElement<TKeyValuePair>
    | ReactElement<TextProps>
    | [ReactElement<TIcon>, ReactElement<TSpacer>, ReactElement<TextProps>]
    | [ReactElement<TextProps>, ReactElement<TSpacer>, ReactElement<InputButtonTertiaryProps>]
    | [
        ReactElement<any>,
        ReactElement<TSpacer>,
        ReactElement<TextProps>,
        ReactElement<TSpacer>,
        ReactElement<InputButtonTertiaryProps>,
      ]
}

export const Chip = ({ colorBackground, colorOutline, children, playwrightTestId }: PropsWithChildren<TChip>) => {
  return (
    <Container data-playwright-testid={playwrightTestId}>
      <Composition>
        <BackgroundCard colorBackground={colorBackground} colorOutline={colorOutline} borderRadius={Size.Tiny} />

        <LayoutChip content={children} />
      </Composition>
    </Container>
  )
}
