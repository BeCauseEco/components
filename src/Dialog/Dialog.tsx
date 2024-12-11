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
import { Text, TextProps } from "@new/Text/Text"
// import { Icon } from "@new/Icon/Icon"
import { PlaywrightProps } from "@new/Playwright"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { InputButtonSecondaryProps } from "@new/InputButton/InputButtonSecondary"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { Divider } from "@new/Divider/Divider"
import { Icon } from "@new/Icon/Icon"

const computeMessageColor = (message?: TDialog["message"]) => {
  if (!message) {
    return Color.Neutral
  }

  switch (message[0]) {
    case "notice":
      return Color.Quarternary
    case "warning":
      return Color.Warning
    case "error":
      return Color.Error
    case "hidden":
      return Color.Neutral
    default:
      return message[0] satisfies never
  }
}

const computeMinSize = (size: TDialog["size"]) => {
  switch (size) {
    case Size.Medium:
      return {
        minWidth: "calc(var(--BU) * 160)",
        minHeight: "auto",
      }

    case Size.Large:
      return {
        minWidth: "calc(var(--BU) * 320)",
        minHeight: "auto",
      }

    case Size.Huge:
      return {
        minWidth: "calc(100vw - calc(var(--BU) * 10))",
        minHeight: `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
      }
  }
}

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
  minWidth: computeMinSize(p.size).minWidth,
  minHeight: computeMinSize(p.size).minHeight,
  zIndex: 99999,
  // TO-DO: @cllpe
  // maxHeight: `calc(100vh - ${offsetTop} - calc(var(--BU) * 10))`,
  outline: "none",
}))

const TitleAndDescription = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
})

export type TDialog = PlaywrightProps & {
  size: Size.Medium | Size.Large | Size.Huge
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  collapseHeight?: boolean
  title?: ReactElement<TextProps>
  description?: ReactElement<TextProps> | ReactElement<TextProps | SpacerProps>[]
<<<<<<< HEAD
  message?: ["notice" | "warning" | "error" | "hidden", string]
=======
  message?: ["notice" | "warning" | "error" | "nothing", string]
>>>>>>> 23fe7c30336e6f429f5cce3d656002260f98f04b
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
  message,
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
              contentMiddle={
                <>
                  {content}

<<<<<<< HEAD
                  {message && message[0] !== "hidden" && (
                    <>
                      <Divider fill={[computeMessageColor(message), 200]} />

                      <Stack horizontal colorBackground={[computeMessageColor(message), 100]}>
                        <Align horizontal hug="width" left>
                          {message[0] === "notice" && (
                            <Icon large name="info" fill={[computeMessageColor(message), 800]} style="filled" />
                          )}

                          {(message[0] === "warning" || message[0] === "error") && (
                            <Icon large name="warning" fill={[computeMessageColor(message), 800]} style="filled" />
                          )}
                        </Align>

                        <Spacer xsmall />

                        <Align horizontal left>
                          <Text xsmall fill={[computeMessageColor(message), 800]}>
                            {message[1]}
                          </Text>
                        </Align>
                      </Stack>
                    </>
                  )}

                  <Divider fill={[computeMessageColor(message), message && message[0] !== "hidden" ? 200 : 100]} />
=======
                  {message && message[0] !== "nothing" && (
                    <Stack vertical colorBackground={[Color.Error, 50]}>
                      <Align vertical>
                        <Text fill={[Color.Error, 700]}>{message[1]}</Text>
                      </Align>
                    </Stack>
                  )}
>>>>>>> 23fe7c30336e6f429f5cce3d656002260f98f04b
                </>
              }
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
