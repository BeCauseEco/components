import { ReactElement } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { EOverflowContainerAxis, OverflowContainer } from "@new/OverflowContainer/OverflowContainer"
import { EColor } from "@new/Color"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 2)",
})

const Top = styled.div({
  display: "flex",
  flexDirection: "column",
})

const Bottom = styled.div({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
})

export type TLayoutCombobox = TLayoutBase & {
  contentTop: ReactElement | ReactElement[]
  contentBottom: ReactElement | ReactElement[]
}

export const LayoutCombobox = ({ contentTop, contentBottom }: TLayoutCombobox) => {
  return (
    <Container className="layout-container">
      <OverflowContainer
        axes={EOverflowContainerAxis.Vertical}
        colorBackground={[EColor.White]}
        colorForeground={[EColor.Black, 500]}
        maxHeight={"calc(var(--radix-popover-content-available-height) - calc(var(--BU) * 8))"}
        omitPadding
      >
        <Top>{contentTop}</Top>

        <Bottom>{contentBottom}</Bottom>
      </OverflowContainer>
    </Container>
  )
}
