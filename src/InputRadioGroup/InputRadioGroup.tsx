import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { ReactElement, useId } from "react"
import { PlaywrightProps } from "@new/Playwright"
import { InputRadioGroupItemProps } from "@new/InputRadioGroup/InputRadioGroupItem"
import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Align/Align"

const Root = styled(RadixRadioGroup.Root)<{ marginPosition: "bottom" | "right" }>(p => ({
  display: "flex",
  flexDirection: "inherit",

  "& > *:not(:last-child)": {
    ...(p.marginPosition === "bottom" && { marginBottom: "var(--BU)" }),
    ...(p.marginPosition === "right" && { marginRight: "calc(var(--BU) * 4)" }),
  },
}))

export type InputRadioGroupProps = PlaywrightProps & {
  size: "small" | "large"

  vertical?: boolean
  horizontal?: boolean

  defaultValue: string
  value: string
  onChange: (value: string) => void

  label?: string

  children: ReactElement<InputRadioGroupItemProps> | ReactElement<InputRadioGroupItemProps>[]
}

export const InputRadioGroup = (p: InputRadioGroupProps) => {
  const key = useId()

  return (
    <Stack
      vertical={p.vertical || undefined}
      horizontal={p.horizontal || undefined}
      playwrightTestId={p.playwrightTestId}
      hug
    >
      <Align hug left vertical={p.vertical} horizontal={p.horizontal}>
        <Root
          id={key}
          defaultValue={p.defaultValue}
          value={p.value}
          onValueChange={p.onChange}
          data-playwright-test-id={p.playwrightTestId}
          marginPosition={p["vertical"] && !p["horizontal"] ? "bottom" : "right"}
        >
          {p.children}
        </Root>
      </Align>
    </Stack>
  )
}
