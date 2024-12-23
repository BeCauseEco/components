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

export const Autocomplete = forwardRef<HTMLDivElement, PropsWithChildren<AutocompleteProps>>((p, ref) => {
  return (
    <Container ref={ref} data-playwright-testid={p["data-playwright-testid"]}>
      <Popover open={p.open} onOpenChange={p.onOpenChange} alignment="start" trigger={p.input}>
        <Align vertical topLeft>
          {p.results}
        </Align>
      </Popover>
    </Container>
  )
})
