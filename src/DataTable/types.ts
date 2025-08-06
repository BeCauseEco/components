import { ReactElement } from "react"
import { SortDirection } from "ka-table"
import { ICellTextProps } from "ka-table/props"
import { AlignProps } from "@new/Stack/Align"
import { Color, ColorWithLightness } from "@new/Color"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { InputButtonTertiaryProps } from "@new/InputButton/InputButtonTertiary"
import { InputButtonIconPrimaryProps } from "@new/InputButton/InputButtonIconPrimary"
import { InputButtonSecondaryProps } from "@new/InputButton/InputButtonSecondary"
import { InputButtonIconSecondaryProps } from "@new/InputButton/InputButtonIconSecondary"
import { InputCheckboxProps } from "@new/InputCheckbox/InputCheckbox"
import { InputComboboxProps } from "@new/InputCombobox/InputCombobox"
import { InputTextSingleProps } from "@new/InputText/InputTextSingle"
import { InputTextDateProps } from "@new/InputText/InputTextDate"
import { PopoverProps } from "@new/Popover/Popover"
import { EditingMode } from "ka-table"

export { SortDirection } from "ka-table"

export enum DataType {
  Internal = "internal",
  Boolean = "boolean",
  Date = "date",
  Number = "number",
  Object = "object",
  String = "string",
  ProgressIndicator = "progressindicator",
  Status = "status",
  List = "list",
  Icon = "icon",
}

export type Column = {
  key: string
  title: string
  dataType: DataType
  maxWidth?: number | `${number}${"%"}`
  minWidth?: number | `${number}${"%"}`
  explodeWidth?: boolean
  preventContentCollapse?: boolean
  sort?: (sortDirection: SortDirection) => (a: any, b: any) => number
  avatar?: string | ((rowData: ICellTextProps["rowData"]) => string | ReactElement | undefined)
  link?: (rowData: ICellTextProps["rowData"]) => string | (() => void) | undefined
  tooltip?: ((rowData: ICellTextProps["rowData"]) => ReactElement<AlignProps> | string | undefined) | boolean
  showTooltipIcon?: boolean
  isEditable?: boolean
  endAdornment?: (rowData: ICellTextProps["rowData"]) => ReactElement<AlignProps> | string | undefined
  startAdornment?: (rowData: ICellTextProps["rowData"]) => ReactElement<AlignProps> | string | undefined
  placeholder?: string
  progressIndicator?: {
    type: "bar" | "circle"

    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          value: number
          color: Color
        }
      | undefined
  }

  status?: {
    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          color: Color
          label: string
        }
      | undefined
  }
  numberFormat?: {
    configure: (value: number, rowData: ICellTextProps["rowData"]) => string
  }
  icon?: {
    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          name: string
          color: ColorWithLightness
        }
      | undefined
  }
  fill?: ((rowData: ICellTextProps["rowData"]) => Color | undefined) | Color | undefined
}

type Children =
  | ReactElement<InputCheckboxProps>
  | ReactElement<InputComboboxProps>
  | ReactElement<InputTextSingleProps>
  | ReactElement<InputTextDateProps>
  | boolean
  | null

type RowActionsElement =
  | ReactElement<InputButtonPrimaryProps>
  | ReactElement<InputButtonIconPrimaryProps>
  | ReactElement<InputButtonSecondaryProps>
  | ReactElement<InputButtonIconSecondaryProps>
  | ReactElement<InputButtonTertiaryProps>
  | ReactElement<InputButtonIconPrimaryProps>
  | ReactElement<InputButtonIconPrimaryProps>
  | ReactElement<PopoverProps>

export type DataTableProps = {
  mode: "simple" | "filter" | "edit"
  data: any[]
  columns: Column[]
  defaultSortColumn: string
  defaultSortDirection?: SortDirection
  rowKeyField: string
  exportName: string
  fixedKeyField?: string
  selectKeyField?: string
  selectDisabledField?: string
  virtualScrolling?: boolean
  loading?: boolean
  loadingElement?: ReactElement
  exportDisable?: boolean
  rowActions?: (rowData: ICellTextProps["rowData"]) => RowActionsElement[]
  onChange?: (value: DataTableProps["data"]) => void
  onChangeRow?: (value: object) => void
  fill?: ColorWithLightness
  stroke?: ColorWithLightness
  children?: Children | Children[]
  editingMode?: EditingMode

  /**
   * @deprecated
   * See DataType enum and/or Column enum for available alternatives - tooltips, links, progress indicators, etc. are all possible using these.
   */
  DEPRICATED_customCellRenderer?: (cellProps: any) => ReactElement | null
}
