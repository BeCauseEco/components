import { ReactElement } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { Size } from "@new/Size"
import { Color } from "@new/Color"
import { LayoutDialog } from "./internal/LayoutDialog"
import styled from "@emotion/styled"
import { EOpacity } from "@new/Opacity"
import { Spacer, SpacerProps } from "@new/Stack/Spacer"
import { EShadow } from "@new/EShadow"
import { TextProps } from "@new/Text/Text"
// import { Icon } from "@new/Icon/Icon"
import { PlaywrightProps } from "@new/Playwright"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { InputButtonSecondaryProps } from "@new/InputButton/InputButtonSecondary"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"

const offsetTop = "128px"

const Overlay = styled(RadixDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  backgroundColor: Color.Neutral,
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
  top: p.size === Size.Medium ? "50%" : `calc(50% + ${offsetTop} / 2)`,
  left: p.size === Size.Medium ? "calc(50% + calc(var(--BU) * 25))" : "50%",
  transform: "translate(-50%, -50%)",
  minWidth: p.size === Size.Medium ? "calc(var(--BU) * 160)" : "calc(100vw - calc(var(--BU) * 10))",
  minHeight: p.size === Size.Medium ? "auto" : `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
  zIndex: 99999,
  // TO-DO: @cllpe
  // maxHeight: `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
}))

const TitleAndDescription = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
})

export type TDialog = PlaywrightProps & {
  size: Size.Medium | Size.Huge
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  collapseHeight?: boolean
  title?: ReactElement<TextProps>
  description?: ReactElement<TextProps> | ReactElement<TextProps | SpacerProps>[]
  buttonPrimary?: ReactElement<InputButtonPrimaryProps>
  buttonSecondary?: ReactElement<InputButtonSecondaryProps>
  buttonTertiary?: ReactElement<InputButtonTertiaryProps>
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
            <BackgroundCard colorBackground={[Color.White]} borderRadius={Size.Tiny} shadow={EShadow.Large} />

            <LayoutDialog
              contentStart={
                <TitleAndDescription>
                  {title}

                  {description && <Spacer xsmall />}

                  {description}
                </TitleAndDescription>
              }
              contentMiddle={content}
              contentEnd={
                <>
                  {buttonTertiary && buttonTertiary}

                  {buttonSecondary && (
                    <>
                      <Spacer small />

                      {buttonSecondary}
                    </>
                  )}

                  {buttonPrimary && (
                    <>
                      <Spacer small />

                      {buttonPrimary}
                    </>
                  )}
                </>
              }
              buttonClose={
                <RadixDialogClose asChild>
                  {/* <InputButtonPrimary medium>
                    <Icon name="close" size={Size.Large} color={[Color.Neutral, 700]} />
                  </InputButtonPrimary> */}
                </RadixDialogClose>
              }
            />
          </Composition>
        </Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
