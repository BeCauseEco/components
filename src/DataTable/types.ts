import { CSSProperties, ReactElement, ReactNode } from "react"
import { SortDirection } from "ka-table"
import { ICellTextProps } from "ka-table/props"
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

export type DataTableTextSize = "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large"

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

export type DataTableExportConfig = {
  /** When true, renders a CSV-download button in the filter row, top-right. */
  allowCsv: boolean
  /** Base filename, without extension. Example: "Application progress". */
  filename: string
  /** When true, appends a UTC timestamp (`yyyyMMddHHmmss`) before the `.csv` extension. */
  appendTimestampToFilename?: boolean
  /** Optional callback invoked after a successful CSV download. Use for analytics. */
  onExport?: () => void
}

export type Column = {
  key: string
  title: string
  dataType: DataType
  /** When true, this column is never rendered in the table (never reaches ka-table,
   *  never appears in any "visible columns" surface), but is always included in CSV
   *  export when `enableExports.allowCsv` is true. Use for machine-only data (e.g.
   *  GUIDs) that users should not see but that downstream import workflows depend on.
   *  Performance: alwaysHidden columns are stripped from p.columns before reaching
   *  ka-table, so they have zero render cost. */
  alwaysHidden?: boolean
  maxWidth?: `${number}${"px"}` | `${number}${"%"}`
  minWidth?: `${number}${"px"}` | `${number}${"%"}`
  explodeWidth?: boolean
  sort?: (sortDirection: SortDirection) => (a: any, b: any) => number
  avatar?: string | ((rowData: ICellTextProps["rowData"]) => string | ReactElement | undefined)
  link?: (rowData: ICellTextProps["rowData"]) => string | (() => void) | undefined
  tooltip?: ((rowData: ICellTextProps["rowData"]) => ReactElement | string | undefined) | boolean
  showTooltipIcon?: boolean
  headerTooltip?: string
  /**
   * Whether this column's cells are editable in `mode="edit"` + `editingMode="Cell"`.
   * Pass a function for per-row gating; ka-table's cell editor will not open on rows
   * where the function returns `false`. Omitted = editable; explicit `false` = never editable.
   */
  isEditable?: boolean | ((rowData: ICellTextProps["rowData"]) => boolean)
  /**
   * Inline CSS applied to the cell's text by the built-in cell renderers (OptimizedCell, List),
   * so it survives emotion class specificity without consumers having to override rendering themselves.
   * Pass a function for per-row styling; return `undefined` for rows that should keep the default style.
   */
  cellStyle?: CSSProperties | ((rowData: ICellTextProps["rowData"]) => CSSProperties | undefined)
  /**
   * Adornment pushed to the trailing edge (end) of the cell, separated from the content.
   * Use for end-of-row affordances like action menus, status markers, or icon buttons.
   * For an inline suffix that hugs the content (e.g. a "%" unit), use {@link suffixAdornment}.
   */
  endAdornment?: (rowData: ICellTextProps["rowData"]) => ReactElement | string | undefined
  /**
   * Adornment rendered inline immediately after the cell content (a suffix), e.g. a unit like "%".
   * Unlike {@link endAdornment}, it is not pushed to the end of the cell.
   */
  suffixAdornment?: (rowData: ICellTextProps["rowData"]) => ReactElement | string | undefined
  startAdornment?: (rowData: ICellTextProps["rowData"]) => ReactElement | string | undefined
  /**
   * Function to generate footer content for each cell
   * @param rowData - The data object for the current row
   * @returns Footer content as ReactElement, or undefined to show no footer
   */
  footer?: (rowData: ICellTextProps["rowData"]) => ReactElement | undefined | null
  placeholder?: string
  progressIndicator?: {
    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          value: number
          color: Color
          /** Used by CSV export; falls back to `${value}%` when absent */
          csvValue?: string
        }
      | undefined
  }

  status?: {
    configure: (rowData: ICellTextProps["rowData"]) =>
      | {
          color: Color
          label: string
          pulse?: boolean
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

  /** Validation constraints for DataType.Number columns in edit mode.
   * The cell editor blocks keystrokes that would exceed these limits.
   *
   * Both `maxIntegerDigits` and `maxDecimalDigits` must be non-negative integers:
   * - `0` is allowed (e.g. `maxIntegerDigits = 0` permits values like ".5").
   * - Negative values are not supported. */
  numberValidation?: {
    /** Maximum number of digits allowed in the integer part. Must be a non-negative integer. */
    maxIntegerDigits?: number
    /** Maximum number of digits allowed in the decimal part. Must be a non-negative integer. */
    maxDecimalDigits?: number
  }

  comboboxOptions?: {
    /** Placeholder text for the search input. Providing this will automatically enable filtering */
    filterPlaceholder?: string
    /** Text shown when no results match the search. Providing this will automatically enable filtering */
    filterNoResults?: string

    renderPopoverInParentContainer?: boolean | HTMLElement
  }

  fill?: ((rowData: ICellTextProps["rowData"]) => Color | undefined) | Color | undefined

  /** When present, this column emits N CSV columns instead of 1. Used when a single
   *  display column shows joined fields ("12.345, -67.890") but the CSV needs them
   *  split for downstream import workflows. The function must return the same number
   *  of entries in the same order for every row, or columns will misalign. Headers
   *  come from each entry's `title` (the column's own `title` is ignored for CSV). */
  csvExpand?: (rowData: ICellTextProps["rowData"]) => { title: string; value: string }[]
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
  fixedKeyField?: keyof TData & string
  selectedRows?: (string | number)[]
  onSelectionChange?: (selectedRows: (string | number)[]) => void
  disabledRows?: (string | number)[]
  loading?: boolean
  loadingElement?: ReactElement
  disableSorting?: boolean
  rowActions?: (rowData: TData) => RowActionsElement[]
  onChange?: (value: TData[]) => void
  onChangeRow?: (value: TData) => void
  fill?: ColorWithLightness
  stroke?: ColorWithLightness
  /** When true, removes the outer border around the table while keeping internal row/cell borders. */
  borderless?: boolean
  /** When true, removes the vertical dotted lines between columns. */
  noColumnLines?: boolean
  children?: ReactNode
  editingMode?: EditingMode
  cellPaddingSize?: "none" | "tiny" | "xsmall" | "small" | "medium"
  textSize?: DataTableTextSize
  /** Enable truncation of column header names with ellipsis. Text wraps up to 2 lines and overflows with "..." after that. Full title shown on hover. */
  ellipsisColumnNames?: boolean

  /**
   * Before using this, see the DataType enum and/or Column enum for available alternatives - tooltips, links, progress indicators, etc. are all possible using these.
   */
  customCellRenderer?: (cellProps: ICellTextProps<TData>) => ReactElement | null
  pagination?: PaginationConfig
  /** Text shown when the table has no data. Defaults to "Nothing found". */
  noDataText?: string
  /** When true, prepends a "#" column showing the 1-indexed row number for each row. */
  showRowNumbers?: boolean
  /** When set with `allowCsv: true`, renders a CSV-download button in the filter row.
   *  Exports every row in `data` (or, when `onSelectionChange` is set and at least one
   *  row is selected, just the selected rows) — ignoring search/sort/pagination — and
   *  every column except `DataType.Internal` and `DataType.Object`. Columns with
   *  `alwaysHidden: true` are always included in the CSV even though they never render
   *  in the table; columns with `csvExpand` produce N CSV columns each. */
  enableExports?: DataTableExportConfig
  /** When provided and it returns true for a row, that row's cells are rendered dimmed
   *  (reduced opacity) to signal a disabled/inactive state. Purely cosmetic — independent
   *  of `disabledRows` (which controls selection); this only affects visual opacity. */
  dimRow?: (rowData: TData) => boolean
}
