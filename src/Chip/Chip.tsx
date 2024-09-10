import { PropsWithChildren, ReactElement } from "react"
import { TText } from "@new/Text/Text"
import { TColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutChip } from "./internal/LayoutChip"
import { Composition } from "@new/Composition/Composition"
import { ESize } from "@new/ESize"
import { TKeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import styled from "@emotion/styled"
import { TPlaywright } from "@new/TPlaywright"

const Container = styled.div({
  display: "flex",
  width: "fit-content",
})

export type TChip = TPlaywright & {
  color: TColor
  children: ReactElement<TText> | ReactElement<TKeyValuePair>
}

export const Chip = ({ color, children, playwrightTestId }: PropsWithChildren<TChip>) => {
  return (
    <Container data-playwright-testid={playwrightTestId}>
      <Composition>
        <BackgroundCard colorBackground={color} borderRadius={ESize.Tiny} />

        <LayoutChip content={children} />
      </Composition>
    </Container>
  )
}
