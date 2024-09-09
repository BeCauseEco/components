import { ReactElement, useEffect } from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { TInputButton } from "@new/InputButton/InputButton"
import { Composition, TComposition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import { LayoutTakeover } from "./internal/LayoutTakeover"
import styled from "@emotion/styled"
import { Spacer } from "@new/Spacer/Spacer"
import { TText } from "@new/Text/Text"
import { TPlaywright } from "@new/TPlaywright"

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

export type TTakeover = TPlaywright & {
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  buttonClose?: ReactElement<TInputButton>
  title?: ReactElement<TText>
  status?: ReactElement<TText>
  buttonPrimary?: ReactElement<TInputButton>
  buttonSecondary?: ReactElement<TInputButton>
  buttonTertiary?: ReactElement<TInputButton>
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

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false} data-playwright-testid={playwrightTestId}>
      <RadixDialog.Portal>
        <RadixDialogContent
          offsetTopOverride={offsetTopOverride}
          offsetLeftOverride={offsetLeftOverride}
          offsetLeftSmallOverride={offsetLeftSmallOverride}
        >
          <Composition explodeHeight>
            <BackgroundCard colorBackground={[EColor.White]} />

            <LayoutTakeover
              contentStart={<>{title}</>}
              contentMiddle={content}
              contentEnd={
                <>
                  {status && (
                    <>
                      {status}

                      <Spacer size={ESize.Large} />
                    </>
                  )}

                  {buttonTertiary && <>{buttonTertiary}</>}

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
              buttonClose={<RadixDialogClose asChild>{buttonClose}</RadixDialogClose>}
            />
          </Composition>
        </RadixDialogContent>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
