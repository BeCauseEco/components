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
import { TText } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"

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
  zIndex: 2,
})

export type TAlertDialog = TPlaywright & {
  title?: ReactElement<TText>
  description?: ReactElement<TText>
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
  playwrightTestId,
}: TAlertDialog) => (
  <RadixAlertDialog.Root>
    <RadixAlertDialog.Trigger asChild>{buttonTrigger}</RadixAlertDialog.Trigger>

    <RadixAlertDialog.Portal>
      <Overlay />

      <Content data-playwright-testid={playwrightTestId}>
        <Composition>
          <BackgroundCard colorBackground={[colorBackground, 50]} borderRadius={ESize.Tiny} shadow={EShadow.Large} />

          <LayoutAlert
            colorBackground={colorBackground}
            contentTop={title}
            contentMiddle={description}
            contentEnd={
              <>
                <RadixAlertDialog.Cancel asChild>{buttonSecondary}</RadixAlertDialog.Cancel>

                <Spacer size={ESize.Small} />

                <RadixAlertDialog.Action asChild>{buttonPrimary}</RadixAlertDialog.Action>
              </>
            }
          />
        </Composition>
      </Content>
    </RadixAlertDialog.Portal>
  </RadixAlertDialog.Root>
)
