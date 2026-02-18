import { ReactElement, ReactNode } from "react"
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
import { PlaywrightProps } from "@new/Playwright"

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

export type ClientPagination = {
  mode: "client"
  pageSize: number
  pageSizeOptions?: number[]
}

export type ServerPagination = {
  mode: "server"
  pageIndex: number
  pageSize: number
  totalCount: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export type PaginationConfig = ClientPagination | ServerPagination

export type Column = {
  key: string
  title: string
  dataType: DataType
  maxWidth?: `${number}${"px"}` | `${number}${"%"}`
  minWidth?: `${number}${"px"}` | `${number}${"%"}`
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
  /**
   * Function to generate footer content for each cell
   * @param rowData - The data object for the current row
   * @returns Footer content as ReactElement, or undefined to show no footer
   */
  footer?: (rowData: ICellTextProps["rowData"]) => ReactElement | undefined | null
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
    configure?: (value: number, rowData: ICellTextProps["rowData"]) => string
    /**
     * Default number of trailing decimal places for DataType.Number columns when no custom configure function is provided.
     *
     * **Formatting Precedence:**
     * 1. `configure()` function (highest priority)
     * 2. `defaultTrailingDecimals` (this property)
     * 3. Global default (2 decimal places)
     *
     * @minimum 0 - No decimal places (integer display)
     * @maximum 20 - Maximum precision allowed by Intl.NumberFormat
     * @default 2
     *
     * @example
     * ```typescript
     * // Column with custom default decimals
     * {
     *   key: "price",
     *   dataType: DataType.Number,
     *   numberFormat: {
     *     defaultTrailingDecimals: 4  // Shows 123.4567
     *   }
     * }
     *
     * // Column with configure() overrides defaultTrailingDecimals
     * {
     *   key: "percentage",
     *   dataType: DataType.Number,
     *   numberFormat: {
     *     defaultTrailingDecimals: 4,  // Ignored when configure() exists
     *     configure: (value) => `${value.toFixed(1)}%`  // Always 1 decimal + %
     *   }
     * }
     * ```
     */
    defaultTrailingDecimals?: number
  }
  dateFormat?: {
    configure?: (value: string | Date, rowData: ICellTextProps["rowData"]) => string
    /**
     * Default date format for DataType.Date columns when no custom configure function is provided.
     *
     * **Formatting Precedence:**
     * 1. `configure()` function (highest priority)
     * 2. `defaultFormat` (this property)
     * 3. Global default (browser locale date format)
     *
     * @default undefined - Uses browser's default locale date format
     *
     * @example
     * ```typescript
     * // Column with custom default format
     * {
     *   key: "createdAt",
     *   dataType: DataType.Date,
     *   dateFormat: {
     *     defaultFormat: "yyyy-MM-dd HH:mm"  // Shows 2023-12-25 14:30
     *   }
     * }
     *
     * // Column with configure() overrides defaultFormat
     * {
     *   key: "deadline",
     *   dataType: DataType.Date,
     *   dateFormat: {
     *     defaultFormat: "yyyy-MM-dd",  // Ignored when configure() exists
     *     configure: (value) => new Date(value).toLocaleDateString()  // Custom format
     *   }
     * }
     * ```
     */
    defaultFormat?: string
  }
  icon?: {
    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          name: string
          color: ColorWithLightness
        }
      | undefined
  }

  comboboxOptions?: {
    /** Placeholder text for the search input. Providing this will automatically enable filtering */
    filterPlaceholder?: string
    /** Text shown when no results match the search. Providing this will automatically enable filtering */
    filterNoResults?: string

    renderPopoverInParentContainer?: boolean | HTMLElement
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

export type DataTableProps<TData = any> = PlaywrightProps & {
  mode?: "simple" | "filter" | "edit"
  data: TData[]
  columns: Column[]
  defaultSortColumn: keyof TData & string
  defaultSortDirection?: SortDirection
  rowKeyField: keyof TData & string
  exportName?: string
  fixedKeyField?: keyof TData & string
  selectedRows?: (string | number)[]
  onSelectionChange?: (selectedRows: (string | number)[]) => void
  disabledRows?: (string | number)[]
  virtualScrollingMaxHeight?: `${number}${"px"}` | `${number}${"vh"}`
  loading?: boolean
  loadingElement?: ReactElement
  exportDisable?: boolean
  disableSorting?: boolean
  rowActions?: (rowData: TData) => RowActionsElement[]
  onChange?: (value: TData[]) => void
  onChangeRow?: (value: TData) => void
  fill?: ColorWithLightness
  stroke?: ColorWithLightness
  children?: ReactNode
  editingMode?: EditingMode
  cellPaddingSize?: "none" | "tiny" | "xsmall" | "small" | "medium"
  textSize?: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"

  /**
   * Before using this, see the DataType enum and/or Column enum for available alternatives - tooltips, links, progress indicators, etc. are all possible using these.
   */
  customCellRenderer?: (cellProps: ICellTextProps<TData>) => ReactElement | null
  pagination?: PaginationConfig
}
