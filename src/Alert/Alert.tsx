import styled from "@emotion/styled"
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { ReactElement } from "react"
import { TInputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { EOpacity } from "@new/Opacity"
import { Color } from "@new/Color"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "../Composition/BackgroundCard"
import { LayoutAlert } from "./internal/LayoutAlert"
import { Size } from "@new/Size"
import { Spacer } from "@new/Spacer/Spacer"
import { EShadow } from "@new/EShadow"
import { TText } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"

const Overlay = styled(RadixAlertDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: Color.Black,
  opacity: EOpacity.Light,
  zIndex: 999999,
})

const Content = styled(RadixAlertDialog.Content)({
  display: "flex",
  position: "fixed",
  top: "50%",
  left: "calc(50% + calc(var(--BU) * 20))",
  transform: "translate(-50%, -50%)",
  width: "calc(var(--BU) * 100)",
  zIndex: 9999999,
})

export type TAlertDialog = TPlaywright & {
  open: boolean
  title?: ReactElement<TText>
  description?: ReactElement<TText>
  buttonPrimary: ReactElement<TInputButtonPrimary>
  buttonSecondary: ReactElement<TInputButtonPrimary>
}

export const Alert = ({ open, title, description, buttonPrimary, buttonSecondary, playwrightTestId }: TAlertDialog) => (
  <RadixAlertDialog.Root open={open}>
    <RadixAlertDialog.Portal>
      <Overlay />

      <Content data-playwright-testid={playwrightTestId}>
        <Composition>
          <BackgroundCard colorBackground={[Color.White]} borderRadius={Size.Tiny} shadow={EShadow.Large} />

          <LayoutAlert
            contentTop={title}
            contentMiddle={description}
            contentEnd={
              <>
                <RadixAlertDialog.Cancel asChild>{buttonSecondary}</RadixAlertDialog.Cancel>

                <Spacer small />

                <RadixAlertDialog.Action asChild>{buttonPrimary}</RadixAlertDialog.Action>
              </>
            }
          />
        </Composition>
      </Content>
    </RadixAlertDialog.Portal>
  </RadixAlertDialog.Root>
)
