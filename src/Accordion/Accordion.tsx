import styled from "@emotion/styled"
import { ReactElement } from "react"
import * as RadixAccordion from "@radix-ui/react-accordion"
import { TAccordionItem } from "./AccordionItem"
import { Size } from "@new/Size"
import { PlaywrightProps } from "@new/Playwright"

const Container = styled.div({
  display: "flex",
  borderRadius: Size.Tiny,
  overflow: "clip",
})

const Root = styled(RadixAccordion.Root)({
  width: "100%",
})

export type TAccordion = PlaywrightProps & {
  items: ReactElement<TAccordionItem> | ReactElement<TAccordionItem>[]
  defaultValue: string
}

export const Accordion = ({ items, defaultValue, playwrightTestId }: TAccordion) => (
  <Container data-playwright-testid={playwrightTestId}>
    <Root defaultValue={defaultValue} type="single" collapsible>
      {items}
    </Root>
  </Container>
)
