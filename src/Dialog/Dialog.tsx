import { ReactNode } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { EInputButtonVariant, InputButton, TInputButton } from "@new/InputButton/InputButton"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import { LayoutDialog } from "./internal/LayoutDialog"
import styled from "@emotion/styled"
import { EOpacity } from "@new/Opacity"
import { Spacer, TSpacer } from "@new/Spacer/Spacer"
import { EShadow } from "@new/EShadow"
import { TText } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import { TPlaywright } from "@new/TPlaywright"

const offsetTop = "128px"

const Overlay = styled(RadixDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: EColor.Black,
  opacity: EOpacity.Light,
  zIndex: 99999,
})

const RadixDialogClose = styled(RadixDialog.Close)({
  display: "flex",
  transform: "translateX(var(--BU))",
  height: "fit-content",
})

type TDialogContentProperties = Pick<TDialog, "size" | "collapseHeight">

const Content = styled(RadixDialog.Content)<TDialogContentProperties>(p => ({
  display: "flex",
  position: "fixed",
  top: p.size === ESize.Medium ? "50%" : `calc(50% + ${offsetTop} / 2)`,
  left: p.size === ESize.Medium ? "calc(50% + calc(var(--BU) * 25))" : "50%",
  transform: "translate(-50%, -50%)",
  minWidth: p.size === ESize.Medium ? "calc(var(--BU) * 160)" : "calc(100vw - calc(var(--BU) * 10))",
  minHeight: p.size === ESize.Medium ? "auto" : `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
  zIndex: 99999,
  // TO-DO: @cllpe
  // maxHeight: `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
}))

const TitleAndDescription = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
})

export type TDialog = TPlaywright & {
  size: ESize.Medium | ESize.Huge
  content: ReactNode<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  collapseHeight?: boolean
  title?: ReactNode<TText>
  description?: ReactNode<TText> | ReactNode<TText | TSpacer>[]
  buttonPrimary?: ReactNode<TInputButton>
  buttonSecondary?: ReactNode<TInputButton>
  buttonTertiary?: ReactNode<TInputButton>
}

export const Dialog = ({
  size,
  content,
  open = false,
  onOpenChange = () => {},
  title,
  collapseHeight,
  description,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
  playwrightTestId,
}: TDialog) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <Overlay />

        <Content size={size} collapseHeight={collapseHeight} data-playwright-testid={playwrightTestId}>
          <Composition>
            <BackgroundCard colorBackground={[EColor.White]} borderRadius={ESize.Tiny} shadow={EShadow.Large} />

            <LayoutDialog
              contentStart={
                <TitleAndDescription>
                  {title}

                  {description && <Spacer size={ESize.Xsmall} />}

                  {description}
                </TitleAndDescription>
              }
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
