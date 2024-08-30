import { EDirection } from "@new/EDirection"
import { ESize } from "@new/ESize"
import { KeyValuePair } from "@new/KeyValuePair/KeyValuePair"
import { TText } from "@new/Text/Text"
import styled from "@emotion/styled"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { PropsWithChildren, ReactElement, useId } from "react"

const Root = styled(RadixRadioGroup.Root)({
  display: "flex",
  flexDirection: "column",
})

export type TInputRadioGroup = {
  defaultValue: string
  value: string
  label?: ReactElement<TText>
  id?: string
  onChange?: (value: string) => void
}

export const InputRadioGroup = ({
  defaultValue,
  value,
  label,
  id,
  onChange,
  children,
}: PropsWithChildren<TInputRadioGroup>) => {
  const key = useId()

  return (
    <KeyValuePair direction={EDirection.Vertical} spacing={ESize.Xsmall}>
      <label htmlFor={id ?? key}>{label}</label>

      <Root id={id ?? key} defaultValue={defaultValue} value={value} onValueChange={onChange}>
        {children}
      </Root>
    </KeyValuePair>
  )
}
