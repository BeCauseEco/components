import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { Spacer } from "@new/Stack/Spacer"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { ICellEditorProps, ICellTextProps } from "ka-table/props"
import { closeRowEditors, openRowEditors, saveRowEditors } from "ka-table/actionCreators"

export const ActionEdit = ({ dispatch, rowKeyValue, disabled }: ICellTextProps & { disabled: boolean }) => {
  return (
    <InputButtonIconTertiary
      size="small"
      iconName="edit"
      onClick={() => dispatch(openRowEditors(rowKeyValue))}
      disabled={disabled}
    />
  )
}

export const ActionSaveCancel = ({ dispatch, rowKeyValue }: ICellEditorProps) => {
  return (
    <Stack horizontal hug>
      <Align horizontal hug>
        <InputButtonTertiary
          width="auto"
          size="small"
          label="Cancel"
          onClick={() => {
            dispatch(closeRowEditors(rowKeyValue))
          }}
        />

        <Spacer xsmall />

        <InputButtonPrimary
          width="auto"
          size="small"
          label="Save"
          onClick={() => {
            dispatch(
              saveRowEditors(rowKeyValue, {
                validate: true,
              }),
            )
          }}
        />
      </Align>
    </Stack>
  )
}
