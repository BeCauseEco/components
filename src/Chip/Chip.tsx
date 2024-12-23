import { PropsWithChildren, ReactElement } from "react"
import { TextProps } from "@new/Text/Text"
import { ColorWithLightness } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutChip } from "./internal/LayoutChip"
import { Composition } from "@new/Composition/Composition"
import { Size } from "@new/Size"
import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"
import { IconProps } from "@new/Icon/Icon"
import { SpacerProps } from "@new/Stack/Spacer"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"

const Container = styled.div({
  display: "flex",
  width: "fit-content",
  cursor: "inherit",
})

export type TChip = PlaywrightProps & {
  colorBackground?: ColorWithLightness
  colorOutline?: ColorWithLightness
  children:
    | ReactElement<TKeyValuePair>
    | ReactElement<TextProps>
    | [ReactElement<IconProps>, ReactElement<SpacerProps>, ReactElement<TextProps>]
    | [ReactElement<TextProps>, ReactElement<SpacerProps>, ReactElement<InputButtonTertiaryProps>]
    | [
        ReactElement<any>,
        ReactElement<SpacerProps>,
        ReactElement<TextProps>,
        ReactElement<SpacerProps>,
        ReactElement<InputButtonTertiaryProps>,
      ]
}

export const Chip = (p: PropsWithChildren<TChip>) => {
  return (
    <Container data-playwright-testid={p["data-playwright-testid"]}>
      <Composition>
        <BackgroundCard colorBackground={p.colorBackground} colorOutline={p.colorOutline} borderRadius={Size.Tiny} />

        <LayoutChip content={p.children} />
      </Composition>
    </Container>
  )
}
