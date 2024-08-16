import styled from "@emotion/styled"
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { ReactElement } from "react"
import { TInputButton } from "@new/InputButton/InputButton"
import { EOpacity } from "@new/Opacity"
import { EColor } from "@new/Color"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "../Composition/BackgroundCard"
import { LayoutAlert } from "./internal/LayoutAlert"
import { ESize } from "@new/ESize"
import { Spacer } from "@new/Spacer/Spacer"
import { EShadow } from "@new/EShadow"
import { Text } from "@new/Text/Text"

const Overlay = styled(RadixAlertDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: EColor.Black,
  opacity: EOpacity.Heavy,
  zIndex: 1,
})

const Content = styled(RadixAlertDialog.Content)({
  display: "flex",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(820px / 2)",
  zIndex: 2,
})

export type TAlertDialog = {
  title: string
  description: string
  colorBackground: EColor
  buttonTrigger: ReactElement<TInputButton>
  buttonPrimary: ReactElement<TInputButton>
  buttonSecondary?: ReactElement<TInputButton>
}

export const Alert = ({
  title,
  description,
  colorBackground,
  buttonTrigger,
  buttonPrimary,
  buttonSecondary,
}: TAlertDialog) => (
  <RadixAlertDialog.Root>
    <RadixAlertDialog.Trigger asChild>{buttonTrigger}</RadixAlertDialog.Trigger>

    <RadixAlertDialog.Portal>
      <Overlay />

      <Content>
        <Composition>
          <BackgroundCard colorBackground={[colorBackground, 50]} borderRadius={ESize.Tiny} shadow={EShadow.Large} />

          <LayoutAlert
            colorBackground={colorBackground}
            contentTop={
              <Text size={ESize.Small} color={[EColor.Black, 700]} wrap>
                {title}
              </Text>
            }
            contentMiddle={
              <Text size={ESize.Medium} color={[EColor.Black, 700]} wrap>
                {description}
              </Text>
            }
            contentEnd={
              <>
                <RadixAlertDialog.Action asChild>{buttonPrimary}</RadixAlertDialog.Action>

                <Spacer size={ESize.Small} />

                <RadixAlertDialog.Cancel asChild>{buttonSecondary}</RadixAlertDialog.Cancel>
              </>
            }
          />
        </Composition>
      </Content>
    </RadixAlertDialog.Portal>
  </RadixAlertDialog.Root>
)
