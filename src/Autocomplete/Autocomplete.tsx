import styled from "@emotion/styled"
import { EColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { LayoutSingle } from "@new/Composition/LayoutSingle"
import { EAlignment } from "@new/EAlignment"
import { EDirection } from "@new/EDirection"
import { EShadow } from "@new/EShadow"
import { ESize } from "@new/ESize"
import { Popover } from "@new/Popover/Popover"
import { TPlaywright } from "@new/TPlaywright"
import { forwardRef, PropsWithChildren, ReactElement } from "react"

const Container = styled.div({
  display: "flex",
})

export type TAutocomplete = TPlaywright & {
  input: ReactElement
  results: ReactElement | ReactElement[]

  open: boolean
  setOpen: (open: boolean) => void

  colorPopOverBackground: EColor
}

export const Autocomplete = forwardRef<HTMLDivElement, PropsWithChildren<TAutocomplete>>((props, ref) => {
  const { playwrightTestId, input, results, colorPopOverBackground, open, setOpen } = props

  return (
    <Container ref={ref} data-playwright-testid={playwrightTestId}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        alignment={EAlignment.Start}
        trigger={input}
        background={
          <BackgroundCard
            colorBackground={[colorPopOverBackground, 700]}
            shadow={EShadow.Medium}
            borderRadius={ESize.Tiny}
          />
        }
        layout={<LayoutSingle omitPadding direction={EDirection.Vertical} content={results} />}
      />
    </Container>
  )
})
