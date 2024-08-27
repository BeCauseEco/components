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

const defaultOffsetTop = "64px"
const defaultOffsetLeft = "76px"
const defaultOffsetLeftSmall = "40px"

interface RadixDialogContentProps {
  offsetTop: string
  offsetLeft: string
  offsetLeftSmall: string
}

const RadixDialogContent = styled(RadixDialog.Content)<RadixDialogContentProps>(
  ({ offsetTop, offsetLeft, offsetLeftSmall }) => ({
    display: "flex",
    position: "fixed",
    top: offsetTop,
    left: offsetLeft,
    width: `calc(100vw - ${offsetLeft})`,
    height: `calc(100vh - ${offsetTop})`,
    zIndex: 1,
    maxHeight: `calc(100vh - ${offsetTop})`,
    overflowY: "auto",
    backgroundColor: "red",

    "@media (max-width: 900px)": {
      left: offsetLeftSmall,
      width: `calc(100vw - ${offsetLeftSmall})`,
    },
  }),
)

const RadixDialogClose = styled(RadixDialog.Close)({
  display: "flex",
  transform: "translateX(var(--BU))",
  height: "fit-content",
})

export type TTakeover = {
  content: ReactElement<TComposition>
  open: boolean
  onOpenChange: (open: boolean) => void
  buttonClose?: ReactElement<TInputButton>
  title?: ReactElement<TText>
  status?: ReactElement<TText>
  buttonPrimary?: ReactElement<TInputButton>
  buttonSecondary?: ReactElement<TInputButton>
  buttonTertiary?: ReactElement<TInputButton>
  offsetTop?: string
  offsetLeft?: string
  offsetLeftSmall?: string
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
  offsetTop = defaultOffsetTop,
  offsetLeft = defaultOffsetLeft,
  offsetLeftSmall = defaultOffsetLeftSmall,
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
    <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <RadixDialog.Portal>
        <RadixDialogContent offsetTop={offsetTop} offsetLeft={offsetLeft} offsetLeftSmall={offsetLeftSmall}>
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
