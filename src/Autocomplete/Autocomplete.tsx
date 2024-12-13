import styled from "@emotion/styled"
import { Color } from "@new/Color"
import { InputTextSingleProps } from "@new/InputText/InputTextSingle"
import { Popover } from "@new/Popover/Popover"
import { PlaywrightProps } from "@new/Playwright"
import { forwardRef, PropsWithChildren, ReactElement } from "react"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { Align } from "@new/Stack/Align"

const Container = styled.div({
  display: "flex",
  width: "100%",
})

export type AutocompleteProps = PlaywrightProps & {
  input: ReactElement<InputTextSingleProps> | ReactElement<InputButtonPrimaryProps>
  results: ReactElement | ReactElement[]

  open: boolean
  onOpenChange: (open: boolean) => void

  colorBackground: Color
}

export const Autocomplete = forwardRef<HTMLDivElement, PropsWithChildren<AutocompleteProps>>((props, ref) => {
  const { playwrightTestId, input, results, open, onOpenChange } = props

  return (
    <Container ref={ref} data-playwright-testid={playwrightTestId}>
      <Popover open={open} onOpenChange={onOpenChange} alignment="start" trigger={input}>
        <Align vertical topLeft>
          {results}
        </Align>
      </Popover>
    </Container>
  )
})
