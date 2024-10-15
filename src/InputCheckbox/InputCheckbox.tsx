import styled from "@emotion/styled"
import { ESize } from "@new/ESize"
import { EColor } from "@new/Color"
import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { Icon } from "@new/Icon/Icon"
import { TText } from "@new/Text/Text"
import { ReactElement, useId } from "react"
import { EDirection } from "@new/EDirection"
import { EWeight } from "@new/EWeight"
import { Composition } from "@new/Composition/Composition"
import { BackgroundCard } from "@new/Composition/BackgroundCard"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { LayoutSingle } from "@new/Composition/LayoutSingle"
import { TPlaywright } from "@new/TPlaywright"

const Container = styled.div({
  display: "flex",
  height: `calc(var(--BU) * 4)`,

  "& button": {
    all: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: `calc(var(--BU) * 4)`,
    height: `calc(var(--BU) * 4)`,
  },
})

const Root = styled(RadixCheckbox.Root)({
  display: "flex",

  "&:focus": {
    // boxShadow: "0 0 0 2px currentColor",
  },
})

const Label = styled.label({
  display: "flex",
  userSelect: "none",
  cursor: "pointer",
  gap: "5px",
  alignItems: "center",
})

export type TInputCheckBox = TPlaywright & {
  value: boolean | "indeterminate"
  id?: string
  onChange: (value: boolean) => void
  colorBackground: EColor
  colorForeground: EColor
  label?: ReactElement<TText>
  icon?: ReactElement
}

export const InputCheckbox = ({
  value,
  id,
  onChange,
  colorBackground,
  colorForeground,
  label,
  playwrightTestId,
  icon,
}: TInputCheckBox) => {
  const key = useId()

  return (
    <Container id={id} data-playwright-testid={playwrightTestId}>
      <KeyValuePair direction={EDirection.Horizontal} spacing={ESize.Xsmall}>
        <Composition>
          <BackgroundCard colorBackground={[colorBackground, 700]} borderRadius={ESize.Tiny} />

          <LayoutSingle
            direction={EDirection.Vertical}
            omitPadding
            content={
              <Root id={key} checked={value} onCheckedChange={checked => onChange(checked === true)}>
                <RadixCheckbox.Indicator>
                  {value === "indeterminate" && (
                    <Icon name="remove" size={ESize.Small} color={[colorForeground, 700]} weight={EWeight.Heavy} />
                  )}

                  {value === true && (
                    <Icon name="check" size={ESize.Small} color={[colorForeground, 700]} weight={EWeight.Heavy} />
                  )}
                </RadixCheckbox.Indicator>
              </Root>
            }
          />
        </Composition>
        <Label htmlFor={key}>
          {icon}
          {label}
        </Label>
      </KeyValuePair>
    </Container>
  )
}
