import { ReactElement } from "react"
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

const offsetTop = "64px"
const offsetLeft = "76px"

const RadixDialogClose = styled(RadixDialog.Close)({
  display: "flex",
  transform: "translateX(var(--BU))",
  height: "fit-content",
})

const Overlay = styled(RadixDialog.Overlay)({
  display: "flex",
  position: "fixed",
  inset: 0,
  opacity: 0,
  zIndex: 1,
})

const RadixDialogContent = styled(RadixDialog.Content)({
  display: "flex",
  position: "fixed",
  top: offsetTop,
  left: offsetLeft,
  width: `calc(100vw - ${offsetLeft})`,
  height: `calc(100vh - ${offsetTop})`,
  zIndex: 2,
  maxHeight: `calc(100vh - ${offsetTop}`,
  overflowY: "auto",
  backgroundColor: "red",
  outline: "solid 1px blue",
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
}: TTakeover) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <RadixDialog.Portal>
        <Overlay />

        <RadixDialogContent>
          <Composition explodeHeight>
            <BackgroundCard colorBackground={[EColor.White]} />

            <LayoutTakeover
              contentStart={<>{title}</>}
              contentMiddle={content}
              contentEnd={
                <>
                  {status && status}

                  {buttonTertiary && (
                    <>
                      <Spacer size={ESize.Small} />

                      {buttonTertiary}
                    </>
                  )}

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
