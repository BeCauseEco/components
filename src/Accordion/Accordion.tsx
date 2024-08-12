import styled from "@emotion/styled"
import { ReactElement } from "react"
import * as RadixAccordion from "@radix-ui/react-accordion"
import { TAccordionItem } from "./AccordionItem"
import { ESize } from "@new/ESize"

const Container = styled.div({
  display: "flex",
  borderRadius: ESize.Tiny,
  overflow: "clip",
})

const Root = styled(RadixAccordion.Root)({
  width: "100%",
})

export type TAccordion = {
  items: ReactElement<TAccordionItem> | ReactElement<TAccordionItem>[]
  defaultValue: string
}

export const Accordion = ({ items, defaultValue }: TAccordion) => (
  <Container>
    <Root defaultValue={defaultValue} type="single" collapsible>
      {items}
    </Root>
  </Container>
)
