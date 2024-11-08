import styled from "@emotion/styled"
import { Color } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutContextMenu } from "@new/Composition/LayoutContextMenu"
import { EAlignment } from "@new/EAlignment"
import { EDirection } from "@new/EDirection"
import { EShadow } from "@new/EShadow"
import { Size } from "@new/Size"
import { InputTextSingleProps } from "@new/InputText/InputTextSingle"
import { Popover } from "@new/Popover/Popover"
import { Playwright } from "@new/Playwright"
import { forwardRef, PropsWithChildren, ReactElement } from "react"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"

const Container = styled.div({
  display: "flex",
})

export type TAutocomplete = Playwright & {
  input: ReactElement<InputTextSingleProps> | ReactElement<InputButtonPrimaryProps>
  results: ReactElement | ReactElement[]

  open: boolean
  onOpenChange: (open: boolean) => void

  colorBackground: Color
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
          <BackgroundCard colorBackground={[colorBackground, 700]} shadow={EShadow.Medium} borderRadius={Size.Tiny} />
        }
        layout={<LayoutContextMenu direction={EDirection.Vertical} content={results} />}
      />
    </Container>
  )
})
