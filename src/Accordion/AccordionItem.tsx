import styled from "@emotion/styled"
import { ReactElement } from "react"
import * as Accordion from "@radix-ui/react-accordion"
import { keyframes } from "@emotion/react"
import { Composition } from "@new/Composition/Composition"
import { LayoutStackVertical } from "@new/Composition/LayoutStackVertical"
import { TText } from "@new/Text/Text"
import { TColor } from "@new/Color"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { TIcon } from "@new/Icon/Icon"
import { TPlaywright } from "@new/TPlaywright"
import { Align } from "@new/Align/Align"

type TContainerProperties = Omit<TAccordionItem, "content" | "label" | "colorHead" | "colorContent">

const Item = styled(Accordion.Item)<TContainerProperties>({
  width: "100%",
  overflow: "hidden",
})

const Header = styled(Accordion.Header)({
  all: "unset",
  display: "flex",
})

const Trigger = styled(Accordion.Trigger)({
  all: "unset",
  width: "100%",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
})

const Label = styled.div({
  display: "flex",
  alignItems: "center",
})

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-accordion-content-height)" },
})

const slideUp = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: 0 },
})

const Content = styled(Accordion.Content)({
  width: "100%",
  overflow: "hidden",

  "&[data-state='open']": {
    animation: `${slideDown} 250ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },

  "&[data-state='closed']": {
    animation: `${slideUp} 250ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
})

export type TAccordionItem = TPlaywright & {
  label: ReactElement<TText> | ReactElement<TIcon>
  value: string
  content: ReactElement | ReactElement[] | undefined
  colorHead: TColor
  colorContent: TColor
}

export const AccordionItem = ({ label, value, content, colorHead, colorContent, playwrightTestId }: TAccordionItem) => (
  <Item value={value} data-playwright-testid={playwrightTestId}>
    <Header>
      <Trigger>
        <Composition>
          <BackgroundCard colorBackground={colorHead} />

          <LayoutStackVertical>
            <Align vertical left>
              <Label key="accordion-item-label">{label}</Label>
            </Align>
          </LayoutStackVertical>
        </Composition>
      </Trigger>
    </Header>

    <Content>
      <Composition>
        <BackgroundCard colorBackground={colorContent} />

        <LayoutStackVertical>
          <Align vertical left>
            <Label key="accordion-item-label">{content}</Label>
          </Align>
        </LayoutStackVertical>
      </Composition>
    </Content>
  </Item>
)
