import styled from "@emotion/styled"
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { ReactElement } from "react"
import { EOpacity } from "@new/Opacity"
import { Color } from "@new/Color"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "../Composition/BackgroundCard"
import { LayoutAlert } from "./internal/LayoutAlert"
import { Size } from "@new/Size"
import { Spacer } from "@new/Stack/Spacer"
import { EShadow } from "@new/EShadow"
import { TextProps } from "@new/Text/Text"
import { PlaywrightProps } from "@new/Playwright"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"

const Overlay = styled(RadixAlertDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: Color.Neutral,
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

export type TAlertDialog = PlaywrightProps & {
  open: boolean
  title?: ReactElement<TextProps>
  description?: ReactElement<TextProps>
  buttonPrimary: ReactElement<InputButtonPrimaryProps>
  buttonSecondary: ReactElement<InputButtonPrimaryProps>
}

export const Alert = (p: TAlertDialog) => (
  <RadixAlertDialog.Root open={p.open}>
    <RadixAlertDialog.Portal>
      <Overlay />

      <Content data-playwright-testid={p["data-playwright-testid"]}>
        <Composition>
          <BackgroundCard colorBackground={[Color.White]} borderRadius={Size.Tiny} shadow={EShadow.Large} />

          <LayoutAlert
            contentTop={p.title}
            contentMiddle={p.description}
            contentEnd={
              <>
                <RadixAlertDialog.Cancel asChild>{p.buttonSecondary}</RadixAlertDialog.Cancel>

                <Spacer small />

                <RadixAlertDialog.Action asChild>{p.buttonPrimary}</RadixAlertDialog.Action>
              </>
            }
          />
        </Composition>
      </Content>
    </RadixAlertDialog.Portal>
  </RadixAlertDialog.Root>
)
