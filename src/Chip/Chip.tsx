import { PropsWithChildren, ReactElement } from "react"
import { TText } from "@new/Text/Text"
import { TColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutChip } from "./internal/LayoutChip"
import { Composition } from "@new/Composition/Composition"
import { ESize } from "@new/ESize"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"
import { TIcon } from "@new/Icon/Icon"
import { TSpacer } from "@new/Spacer/Spacer"
import { TInputButton } from "@new/InputButton/InputButton"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"

const Container = styled.div({
  display: "flex",
  width: "fit-content",
  cursor: "inherit",
})

export type TChip = TPlaywright & {
  colorBackground?: TColor
  colorOutline?: TColor
  children:
    | ReactElement<TKeyValuePair>
    | ReactElement<TText>
    | [ReactElement<TIcon>, ReactElement<TSpacer>, ReactElement<TText>]
    | [ReactElement<TText>, ReactElement<TSpacer>, ReactElement<TInputButton>]
}

export const Chip = ({ colorBackground, colorOutline, children, playwrightTestId }: PropsWithChildren<TChip>) => {
  return (
    <Container data-playwright-testid={playwrightTestId}>
      <Composition>
        <BackgroundCard colorBackground={colorBackground} colorOutline={colorOutline} borderRadius={ESize.Tiny} />

        <LayoutChip content={children} />
      </Composition>
    </Container>
  )
}
