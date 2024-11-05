import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { ReactElement, useId } from "react"
import { TPlaywright } from "@new/TPlaywright"
import { TInputRadioGroupItem } from "@new/Aligned/InputRadioGroup/InputRadioGroupItem"
import { Stack } from "@new/Aligned/Stack/Stack"
import { Align } from "@new/Aligned/Align/Align"

const Root = styled(RadixRadioGroup.Root)<{ marginPosition: "bottom" | "right" }>(p => ({
  display: "flex",
  flexDirection: "inherit",

  "& > *:not(:last-child)": {
    ...(p.marginPosition === "bottom" && { marginBottom: "var(--BU)" }),
    ...(p.marginPosition === "right" && { marginRight: "calc(var(--BU) * 4)" }),
  },
}))

export type TInputRadioGroup = TPlaywright & {
  size: "small" | "large"

  vertical?: boolean
  horizontal?: boolean

  defaultValue: string
  value: string
  onChange: (value: string) => void

  children: ReactElement<TInputRadioGroupItem> | ReactElement<TInputRadioGroupItem>[]
}

export const InputRadioGroup = (p: TInputRadioGroup) => {
  const key = useId()

  return (
    <Stack
      collapse
      vertical={p.vertical || undefined}
      horizontal={p.horizontal || undefined}
      playwrightTestId={p.playwrightTestId}
    >
      <Align collapse left vertical={p.vertical} horizontal={p.horizontal}>
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
