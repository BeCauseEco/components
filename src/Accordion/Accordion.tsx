import styled from "@emotion/styled"
import { ReactElement } from "react"
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

type TAccordionBase = TPlaywright & {
  items: ReactElement<TAccordionItem> | ReactElement<TAccordionItem>[]
  collapsible: boolean
}

export type TAccordionSingle = TAccordionBase & {
  type: "single"
  value?: string
  onValueChange?: (value: string) => void
}

export type TAccordionMultiple = TAccordionBase & {
  type: "multiple"
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export const Accordion = ({
  type,
  items,
  value,
  onValueChange,
  collapsible,
  playwrightTestId,
}: TAccordionSingle | TAccordionMultiple) => (
  <Container data-playwright-testid={playwrightTestId}>
    {type === "single" ? (
      <Root
        type="single"
        value={value as string}
        onValueChange={v => (onValueChange ? onValueChange(v as string) : () => {})}
        collapsible={collapsible}
      >
        {items}
      </Root>
    ) : (
      <Root
        type="multiple"
        value={value as string[]}
        onValueChange={v => (onValueChange ? onValueChange(v as string[]) : () => {})}
      >
        {items}
      </Root>
    )}
  </Container>
)
