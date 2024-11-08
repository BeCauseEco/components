import { PropsWithChildren, ReactElement } from "react"
import { TText } from "@new/Text/Text"
import { ColorLightness } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutChip } from "./internal/LayoutChip"
import { Composition } from "@new/Composition/Composition"
import { Size } from "@new/Size"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"
import { TIcon } from "@new/Icon/Icon"
import { TSpacer } from "@new/Spacer/Spacer"
import { TInputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"

const Container = styled.div({
  display: "flex",
  width: "fit-content",
  cursor: "inherit",
})

export type TChip = TPlaywright & {
  colorBackground?: ColorLightness
  colorOutline?: ColorLightness
  children:
    | ReactElement<TKeyValuePair>
    | ReactElement<TText>
    | [ReactElement<TIcon>, ReactElement<TSpacer>, ReactElement<TText>]
    | [ReactElement<TText>, ReactElement<TSpacer>, ReactElement<TInputButtonPrimary>]
    | [
        ReactElement<any>,
        ReactElement<TSpacer>,
        ReactElement<TText>,
        ReactElement<TSpacer>,
        ReactElement<TInputButtonPrimary>,
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
