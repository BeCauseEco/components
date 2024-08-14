import { ReactElement } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { EInputButtonVariant, InputButton, TInputButton } from "@new/InputButton/InputButton"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import { LayoutDialog } from "./LayoutDialog"
import styled from "@emotion/styled"
import { EOpacity } from "@new/Opacity"
import { Spacer } from "@new/Spacer/Spacer"
import { EDirection } from "@new/EDirection"
import { EShadow } from "@new/EShadow"
import { TText } from "@new/Text/Text"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { Icon } from "@new/Icon/Icon"

const offsetTop = "64px"

const Overlay = styled(RadixDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: EColor.Black,
  opacity: EOpacity.Heavy,
  zIndex: 1,
})

const RadixDialogClose = styled(RadixDialog.Close)({
  display: "flex",
  transform: "translateX(var(--BU))",
  height: "fit-content",
})

type TDialogContentProperties = Pick<TDialog, "size">

const Content = styled(RadixDialog.Content)<TDialogContentProperties>(p => ({
  display: "flex",
  position: "fixed",
  top: p.size === ESize.Medium ? "50%" : `calc(50% + ${offsetTop} / 2)`,
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: p.size === ESize.Medium ? "calc(var(--BU) * 40))" : "calc(100vw - calc(var(--BU) * 10))",
  height: p.size === ESize.Medium ? "auto" : `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
  zIndex: 2,
  maxHeight: `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
  overflowY: "auto",
}))

export type TDialog = {
  size: ESize.Medium | ESize.Huge
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactElement<TText>
  description?: ReactElement<TText>
  buttonPrimary?: ReactElement<TInputButton>
  buttonSecondary?: ReactElement<TInputButton>
  buttonTertiary?: ReactElement<TInputButton>
}

export const Dialog = ({
  size,
  content,
  open = false,
  onOpenChange = () => {},
  title,
  description,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
}: TDialog) => {
  let contentStart: ReactElement | null = null

  if (title || description) {
    contentStart = (
      <KeyValuePair direction={EDirection.Vertical} spacing={ESize.Xsmall}>
        {title}
        {description}
      </KeyValuePair>
    )
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <Overlay />

        <Content size={size}>
          <Composition>
            <BackgroundCard colorBackground={[EColor.White]} borderRadius={ESize.Tiny} shadow={EShadow.Large} />

            <LayoutDialog
              contentStart={contentStart}
              contentMiddle={content}
              contentEnd={
                <>
                  {buttonTertiary && buttonTertiary}

                  {buttonSecondary && (
                    <>
                      <Spacer size={ESize.Small} />

                      {buttonSecondary}
                    </>
                  )}

                  {buttonPrimary && (
                    <>
                      <Spacer size={ESize.Small} />

                      {buttonPrimary}
                    </>
                  )}
                </>
              }
              buttonClose={
                <RadixDialogClose asChild>
                  <InputButton size={ESize.Medium} variant={EInputButtonVariant.Transparent} color={EColor.Black}>
                    <Icon name="close" size={ESize.Large} color={[EColor.Black, 700]} />
                  </InputButton>
                </RadixDialogClose>
              }
            />
          </Composition>
        </Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
