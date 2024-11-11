import { ReactElement, useEffect } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { Color } from "@new/Color"
import { LayoutTakeover } from "./internal/LayoutTakeover"
import styled from "@emotion/styled"
import { Spacer } from "@new/Spacer/Spacer"
import { TextProps } from "@new/Text/Text"
import { Playwright } from "@new/Playwright"
import { InputButtonIconTertiaryProps } from "@new/InputButton/InputButtonIconTertiary"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { InputButtonSecondaryProps } from "@new/InputButton/InputButtonSecondary"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"

const offsetTop = "64px"
const offsetLeft = "76px"
const offsetLeftSmall = "40px"

const RadixDialogContent = styled(RadixDialog.Content)<
  Pick<TTakeover, "offsetTopOverride" | "offsetLeftOverride" | "offsetLeftSmallOverride">
>(p => ({
  display: "flex",
  position: "fixed",
  top: p.offsetTopOverride,
  left: p.offsetLeftOverride,
  width: `calc(100vw - ${p.offsetLeftOverride})`,
  height: `calc(100vh - ${p.offsetTopOverride})`,
  zIndex: 1,
  maxHeight: `calc(100vh - ${p.offsetTopOverride})`,
  overflowY: "auto",
  backgroundColor: "red",

  "@media (max-width: 900px)": {
    left: p.offsetLeftSmallOverride,
    width: `calc(100vw - ${p.offsetLeftSmallOverride})`,
  },
}))

const RadixDialogClose = styled(RadixDialog.Close)({
  display: "flex",
  transform: "translateX(var(--BU))",
  height: "fit-content",
})

export type TTakeover = Playwright & {
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  buttonClose?: ReactElement<InputButtonIconTertiaryProps>
  title?: ReactElement<TextProps>
  status?: ReactElement<TextProps>
  buttonPrimary?: ReactElement<InputButtonPrimaryProps>
  buttonSecondary?: ReactElement<InputButtonSecondaryProps>
  buttonTertiary?: ReactElement<InputButtonTertiaryProps>
  offsetTopOverride?: string
  offsetLeftOverride?: string
  offsetLeftSmallOverride?: string
}

export const Takeover = ({
  content,
  open = false,
  onOpenChange = () => {},
  title,
  status,
  buttonClose,
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
  offsetTopOverride = offsetTop,
  offsetLeftOverride = offsetLeft,
  offsetLeftSmallOverride = offsetLeftSmall,
  playwrightTestId,
}: TTakeover) => {
  useEffect(() => {
    if (open) {
      document.querySelectorAll("body")[0].style.overflowY = "hidden"
    } else {
      document.querySelectorAll("body")[0].style.overflowY = "visible"
    }

    return () => {
      document.querySelectorAll("body")[0].style.overflowY = "visible"
    }
  }, [open])

  const contentEnd: ReactElement[] = []

  if (status) {
    contentEnd.push(status)
    contentEnd.push(<Spacer large />)
  }

  if (buttonTertiary) {
    contentEnd.push(buttonTertiary)
  }

  if (buttonSecondary) {
    contentEnd.push(<Spacer small />)
    contentEnd.push(buttonSecondary)
  }

  if (buttonPrimary) {
    contentEnd.push(<Spacer small />)
    contentEnd.push(buttonPrimary)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false} data-playwright-testid={playwrightTestId}>
      <RadixDialog.Portal>
        <RadixDialogContent
          offsetTopOverride={offsetTopOverride}
          offsetLeftOverride={offsetLeftOverride}
          offsetLeftSmallOverride={offsetLeftSmallOverride}
        >
          <Composition explodeHeight>
            <BackgroundCard colorBackground={[Color.White]} />

            <LayoutTakeover
              contentStart={title}
              contentMiddle={content}
              contentEnd={contentEnd.length > 0 ? contentEnd : undefined}
              buttonClose={<RadixDialogClose asChild>{buttonClose}</RadixDialogClose>}
            />
          </Composition>
        </RadixDialogContent>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
