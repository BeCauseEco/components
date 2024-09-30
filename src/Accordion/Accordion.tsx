import styled from "@emotion/styled"
import { ReactNode } from "react"
import * as RadixAccordion from "@radix-ui/react-accordion"
import { TAccordionItem } from "./AccordionItem"
import { ESize } from "@new/ESize"
import { TPlaywright } from "@new/TPlaywright"

const Container = styled.div({
  display: "flex",
  borderRadius: ESize.Tiny,
  overflow: "clip",
})

const Root = styled(RadixAccordion.Root)({
  width: "100%",
})

export type TAccordion = TPlaywright & {
  items: ReactNode<TAccordionItem> | ReactNode<TAccordionItem>[]
  defaultValue: string
}

export const Accordion = ({ items, defaultValue, playwrightTestId }: TAccordion) => (
  <Container data-playwright-testid={playwrightTestId}>
    <Root defaultValue={defaultValue} type="single" collapsible>
      {items}
    </Root>
  </Container>
)
