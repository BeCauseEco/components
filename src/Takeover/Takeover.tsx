import { ReactElement, useEffect } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { Color } from "@new/Color"
import { LayoutTakeover } from "./internal/LayoutTakeover"
import styled from "@emotion/styled"
import { Spacer } from "@new/Stack/Spacer"
import { TextProps } from "@new/Text/Text"
import { PlaywrightProps } from "@new/Playwright"
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

export type TTakeover = PlaywrightProps & {
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

export const Takeover = (p: TTakeover) => {
  useEffect(() => {
    if (p.open) {
      document.querySelectorAll("body")[0].style.overflowY = "hidden"
    } else {
      document.querySelectorAll("body")[0].style.overflowY = "visible"
    }

    return () => {
      document.querySelectorAll("body")[0].style.overflowY = "visible"
    }
  }, [p.open])

  const contentEnd: ReactElement[] = []

  if (p.status) {
    contentEnd.push(p.status)
    contentEnd.push(<Spacer large />)
  }

  if (p.buttonTertiary) {
    contentEnd.push(p.buttonTertiary)
  }

  if (p.buttonSecondary) {
    contentEnd.push(<Spacer small />)
    contentEnd.push(p.buttonSecondary)
  }

  if (p.buttonPrimary) {
    contentEnd.push(<Spacer small />)
    contentEnd.push(p.buttonPrimary)
  }

  return (
    <RadixDialog.Root
      open={p.open}
      onOpenChange={p.onOpenChange}
      modal={false}
      data-playwright-testid={p["data-playwright-testid"]}
    >
      <RadixDialog.Portal>
        <RadixDialogContent
          offsetTopOverride={p.offsetTopOverride || offsetTop}
          offsetLeftOverride={p.offsetLeftOverride || offsetLeft}
          offsetLeftSmallOverride={p.offsetLeftSmallOverride || offsetLeftSmall}
        >
          <Composition explodeHeight>
            <BackgroundCard colorBackground={[Color.White]} />

            <LayoutTakeover
              contentStart={p.title}
              contentMiddle={p.content}
              contentEnd={contentEnd.length > 0 ? contentEnd : undefined}
              buttonClose={<RadixDialogClose asChild>{p.buttonClose}</RadixDialogClose>}
            />
          </Composition>
        </RadixDialogContent>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
