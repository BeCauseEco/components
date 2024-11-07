import styled from "@emotion/styled"
import { EColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutContextMenu } from "@new/Composition/LayoutContextMenu"
import { EAlignment } from "@new/EAlignment"
import { EDirection } from "@new/EDirection"
import { EShadow } from "@new/EShadow"
import { ESize } from "@new/ESize"
import { TInputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { TInputText } from "@new/InputText/InputText"
import { Popover } from "@new/Popover/Popover"
import { TPlaywright } from "@new/TPlaywright"
import { forwardRef, PropsWithChildren, ReactElement } from "react"

const Container = styled.div({
  display: "flex",
})

export type TAutocomplete = TPlaywright & {
  input: ReactElement<TInputText> | ReactElement<TInputButtonPrimary>
  results: ReactElement | ReactElement[]

  open: boolean
  onOpenChange: (open: boolean) => void

  colorBackground: EColor
}

export const Autocomplete = forwardRef<HTMLDivElement, PropsWithChildren<TAutocomplete>>((props, ref) => {
  const { playwrightTestId, input, results, colorBackground, open, onOpenChange } = props

  return (
    <Container ref={ref} data-playwright-testid={playwrightTestId}>
      <Popover
        open={open}
        onOpenChange={onOpenChange}
        alignment={EAlignment.Start}
        trigger={input}
        background={
          <BackgroundCard colorBackground={[colorBackground, 700]} shadow={EShadow.Medium} borderRadius={ESize.Tiny} />
        }
        layout={<LayoutContextMenu direction={EDirection.Vertical} content={results} />}
      />
    </Container>
  )
})
