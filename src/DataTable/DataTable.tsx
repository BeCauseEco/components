"use client"
import { ActionType, EditingMode, SortDirection, SortingMode, Table, useTable } from "ka-table"
import {
  closeEditor,
  closeRowEditors,
  openEditor,
  setFocused,
  moveFocusedRight,
  moveFocusedLeft,
} from "ka-table/actionCreators"
import { Cell } from "ka-table/Models/Cell"
import { Focused } from "ka-table/Models/Focused"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Color, computeColor } from "@new/Color"
import { Icon } from "@new/Icon/Icon"
import { Children, ReactNode, useCallback, useEffect, useId, useRef, useState, useMemo } from "react"
import _debounce from "lodash/debounce"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { kaPropsUtils } from "ka-table/utils"
import { Tooltip } from "@new/Tooltip/Tooltip"

// Import from our new modular structure
import { DataTableProps, DataType, Column } from "./types"
import { formatValue, calculateColumnWidth, computeTotalPages, resolveColumnSizing } from "./utils"
import { createDataTableStyles } from "./styles"
import { CellInputTextSingle, CellInputTextDate, CellInputCheckbox, CellInputCombobox } from "./internal/CellEditors"
import { CellProgressIndicator, CellStatus, CellIcon } from "./internal/CellRenderers"
import { KEY_ROW_NUMBER, KEY_ACTIONS, KEY_FLEX_FILLER, TABLE_CELL_EMPTY_STRING } from "./internal/constants"
import { OptimizedCell } from "./internal/OptimizedCellComponents"
import { ScrollEdgeFades } from "./internal/ScrollEdgeFades"
import { DataTablePagination } from "./internal/DataTablePagination"
import { ExportButton } from "./internal/ExportButton"
import { getDisplayableColumns } from "./internal/exportToCsv"
import { sizeClass } from "./internal/textSize"

const DIMMED_ROW_OPACITY = 0.55

// Module constant so the Table receives a referentially stable virtualScrolling prop.
const VIRTUAL_SCROLLING_ENABLED = { enabled: true }

// Re-export for backward compatibility
export { SortDirection } from "ka-table"
export { DataType } from "./types"
export type {
  DataTableProps,
  Column,
  PaginationConfig,
  ClientPagination,
  ServerPagination,
  DataTableExportConfig,
} from "./types"

// Separate search input component to prevent expensive table re-renders whenever the inputValue state changes
const SearchInput = ({ onDebouncedChange }: { onDebouncedChange: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState("")

  const handleOnDebouncedChange = useMemo(
    () =>
      _debounce((newValue: string) => {
        onDebouncedChange(newValue)
      }, 500),
    [onDebouncedChange],
  )

  const onInputValueChanged = (newValue: string) => {
    setInputValue(newValue)
    handleOnDebouncedChange(newValue)
  }

  return (
    <InputTextSingle
      iconNameLeft="search"
      value={inputValue}
      width="fixed"
      size="large"
      placeholder="Search"
      onChange={onInputValueChanged}
      color={Color.Neutral}
    />
  )
}

export const DataTable = <TData = any,>(p: DataTableProps<TData>) => {
  const mode = p.mode ?? "simple"
  const cssScope = useId().replace(/:/g, "datatable")
  const referenceContainer = useRef<HTMLDivElement>(null)

  const textSize = p.textSize
  const isServerMode = p.pagination?.mode === "server"
  const isPaginationOff = p.pagination?.mode === "off"
  const unpaginatedMaxHeight = p.pagination?.mode === "off" ? p.pagination.maxHeight : undefined

  // With pagination off every row lives in the table, so windowing keeps large datasets
  // cheap: ka-table mounts only the rows near the viewport and measures row height and
  // viewport from the first rendered row. Gated on maxHeight because the windowing follows
  // the internal scroll wrapper's scrollTop — without maxHeight that wrapper never scrolls
  // (the page does) and rows that are actually visible would be windowed out. ka-table reads
  // this prop at mount only (it is not among its controlled-prop keys); scroll state then
  // lives in its internal reducer, so our re-renders never reset the scroll position —
  // verified against ka-table 12.0.3; re-check this contract on ka-table upgrades.
  const virtualScrolling =
    p.pagination?.mode === "off" && unpaginatedMaxHeight && p.pagination.virtualize !== false
      ? VIRTUAL_SCROLLING_ENABLED
      : undefined

  const DEFAULT_PAGE_SIZE = 25
  const configuredPageSize = p.pagination && p.pagination.mode !== "off" ? p.pagination.pageSize : undefined

  const [filter, setFilter] = useState("")
  const [clientPageIndex, setClientPageIndex] = useState(0)
  const [clientPageSize, setClientPageSize] = useState(configuredPageSize ?? DEFAULT_PAGE_SIZE)
  // Captured once: the page size the table started with. Used to keep the
  // pagination footer (and its page-size selector) visible after the user
  // enlarges the page size past the row count, so they can change it back.
  const initialClientPageSize = useRef(configuredPageSize ?? DEFAULT_PAGE_SIZE)
  const pageResetKey = `${filter}|${p.pagination?.mode ?? ""}`
  const [lastPageResetKey, setLastPageResetKey] = useState(pageResetKey)
  if (pageResetKey !== lastPageResetKey) {
    setLastPageResetKey(pageResetKey)
    if (p.pagination?.mode !== "server") {
      setClientPageIndex(0)
    }
  }

  const handleSearchChange = useCallback((value: string) => {
    setFilter(value)
  }, [])
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [editColumnId, setEditColumnId] = useState<string>("")

  // Track active sort state so nativeColumns always reflects the current sort,
  // preventing ka-table's controlled props sync from resetting user sort on re-renders
  const [activeSort, setActiveSort] = useState<{ column: string; direction: SortDirection | undefined }>({
    column: p.defaultSortColumn || "",
    direction: p.defaultSortDirection,
  })

  // The sort transition is computed here (not in a functional setState updater) because
  // onSortChange needs the resulting value synchronously, and side effects inside a
  // setState updater are unsafe — StrictMode may invoke updaters twice. The ref keeps
  // this callback reading the latest committed sort state.
  const activeSortRef = useRef(activeSort)
  useEffect(() => {
    activeSortRef.current = activeSort
  }, [activeSort])

  // alwaysHidden columns are stripped from ka-table's input so they have zero render cost.
  // ExportButton still receives the full p.columns so it can include them in the export.
  const tableColumns = useMemo(() => p.columns.filter(c => !c.alwaysHidden), [p.columns])

  // Apply the search filter to the full dataset BEFORE pagination slicing.
  // Server mode is the caller's responsibility, so we pass data through unchanged.
  // Without this step, ka-table's built-in search only sees the current page's rows,
  // causing matches on other pages to appear as "Nothing found".
  const searchedData = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    if (!needle || isServerMode) {
      return p.data
    }
    const searchableColumns = getDisplayableColumns(tableColumns)
    return p.data.filter(row =>
      searchableColumns.some(column => {
        const value = (row as any)[column.key]
        if (value === null || value === undefined) {
          return false
        }
        if (column.dataType === DataType.Boolean) {
          return (needle === "yes" && value === true) || (needle === "no" && value === false)
        }
        if (Array.isArray(value)) {
          return value.some(v => String(v).toLowerCase().includes(needle))
        }
        return String(value).toLowerCase().includes(needle)
      }),
    )
  }, [p.data, tableColumns, p.pagination?.mode, filter])

  // Sort the full (filtered) dataset BEFORE pagination slicing so sorting spans
  // the whole dataset, not just the current page. Server mode is caller-owned.
  // The comparator mirrors ka-table's SortUtils so ka-table re-sorting the
  // sliced page stays a no-op and header click toggling keeps working.
  const sortedData = useMemo(() => {
    if (isServerMode || p.disableSorting) {
      return searchedData
    }
    if (!activeSort.column || !activeSort.direction) {
      return searchedData
    }
    const column = tableColumns.find(c => c.key === activeSort.column) as Column | undefined
    if (!column) {
      return searchedData
    }

    const direction = activeSort.direction
    const customSort = column.sort?.(direction)
    const sign = direction === SortDirection.Ascend ? 1 : -1
    let collator: Intl.Collator | null = null

    const comparator = customSort
      ? (rowA: any, rowB: any) => customSort(rowA[column.key], rowB[column.key])
      : (rowA: any, rowB: any) => {
          const aValue = rowA[column.key]
          const bValue = rowB[column.key]

          if (aValue === bValue) {
            return 0
          }
          if (aValue == null) {
            return -sign
          }
          if (bValue == null) {
            return sign
          }
          if (typeof aValue === "string" && typeof bValue === "string") {
            collator ??= new Intl.Collator(undefined, { sensitivity: "base", numeric: true })
            return sign * collator.compare(aValue, bValue)
          }
          return sign * (aValue < bValue ? -1 : 1)
        }

    return [...searchedData].sort(comparator)
  }, [searchedData, tableColumns, p.pagination?.mode, p.disableSorting, activeSort])

  const paginationConfig = useMemo(() => {
    if (p.pagination?.mode === "server") {
      return {
        pageIndex: p.pagination.pageIndex,
        pageSize: p.pagination.pageSize,
        totalCount: p.pagination.totalCount,
        totalPages: computeTotalPages(p.pagination.totalCount, p.pagination.pageSize),
        onPageChange: p.pagination.onPageChange,
        onPageSizeChange: p.pagination.onPageSizeChange,
        pageSizeOptions: p.pagination.pageSizeOptions,
      }
    }

    return {
      pageIndex: clientPageIndex,
      pageSize: clientPageSize,
      totalCount: searchedData.length,
      totalPages: computeTotalPages(searchedData.length, clientPageSize),
      onPageChange: setClientPageIndex,
      onPageSizeChange: (newSize: number) => {
        setClientPageSize(newSize)
        setClientPageIndex(0)
      },
      pageSizeOptions: (p.pagination?.mode === "client" ? p.pagination.pageSizeOptions : undefined) ?? [
        10, 25, 50, 100,
      ],
    }
  }, [p.pagination, searchedData.length, clientPageIndex, clientPageSize])

  const displayData = useMemo(() => {
    if (isServerMode) {
      return p.data
    }
    if (isPaginationOff) {
      return sortedData
    }
    const start = paginationConfig.pageIndex * paginationConfig.pageSize
    return sortedData.slice(start, start + paginationConfig.pageSize)
  }, [p.data, sortedData, paginationConfig, isServerMode, isPaginationOff])

  // Show the pagination footer when there is more than one page, OR when the
  // user has changed the (client) page size away from its initial value. The
  // latter keeps the page-size selector reachable so a user who enlarged the
  // page size past the row count can still change it back. Server-mode page
  // size is parent-controlled, so the user-changed check only applies client side.
  const userChangedClientPageSize = !isServerMode && clientPageSize !== initialClientPageSize.current
  const showPagination = !isPaginationOff && (paginationConfig.totalPages > 1 || userChangedClientPageSize)

  const selectedFields = useMemo(() => {
    if (!p.selectedRows) {
      return 0
    }
    return p.selectedRows.length
  }, [p.selectedRows])

  const totalSelectableFields = useMemo(() => {
    if (!p.selectedRows && !p.onSelectionChange) {
      return 0
    }
    if (!p.disabledRows) {
      return p.data.length
    }
    return p.data.filter(d => !p.disabledRows?.includes(d[p.rowKeyField] as string | number)).length
  }, [p.data, p.disabledRows, p.rowKeyField, p.selectedRows, p.onSelectionChange])

  const nativeColumns = useMemo(() => {
    const columns = tableColumns.map(c => {
      const column = c as Column

      const sortDirection = mode !== "edit" && column.key === activeSort.column ? activeSort.direction : undefined

      return {
        key: column.key,
        title: column.title,
        dataType: column.dataType,
        progressIndicator: column.progressIndicator,
        status: column.status,
        icon: column.icon,
        avatar: column.avatar,
        link: column.link,
        sort: column.sort,
        tooltip: column.tooltip,
        showTooltipIcon: column.showTooltipIcon,
        headerTooltip: column.headerTooltip,
        sortDirection: sortDirection,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        explodeWidth: column.explodeWidth,
        sizing: column.sizing,
        // Flatten per-row callbacks to `true` so ka-table treats the column as editable;
        // per-row gating happens in the onDispatch interceptor and cell elementAttributes below.
        isEditable: typeof column.isEditable === "function" ? true : column.isEditable,
        endAdornment: column.endAdornment,
        suffixAdornment: column.suffixAdornment,
        startAdornment: column.startAdornment,
        fill: column.fill,
        cellStyle: column.cellStyle,
        footer: column.footer,
        placeholder: column.placeholder,
        numberFormat: column.numberFormat,
        dateFormat: column.dateFormat,
        comboboxOptions: column.comboboxOptions,
      }
    })

    // Prepend row number column if enabled
    if (p.showRowNumbers) {
      columns.unshift({
        key: KEY_ROW_NUMBER,
        title: "#",
        dataType: DataType.Number,
        sortDirection: undefined,
        minWidth: "52px",
        maxWidth: "52px",
      } as any)
    }

    // Add action column for row-level rowActions buttons
    if (p.rowActions) {
      columns.push({
        key: KEY_ACTIONS,
        title: "",
        dataType: DataType.Internal,
        sortDirection: undefined,
      } as any)
    }

    // Flex filler: when a table has NO grow/fill column (and no actions column,
    // which is itself grow), the "fit" columns would still be stretched by the
    // width:100% table. Inject one inert column that absorbs the leftover so the
    // fit columns truly hug. This is NOT @new/Spacer — inside an HTML table only a
    // real <td>/<th> participates in width distribution.
    // Opt-out via `stretchColumns`: an all-fixed-width table can instead let the
    // browser proportionally stretch its real columns to fill the leftover width.
    const hasFlexibleColumn = columns.some(c => {
      const sizing = resolveColumnSizing(c as Column)
      return sizing === "grow" || sizing === "fill"
    })
    if (!hasFlexibleColumn && !p.stretchColumns) {
      columns.push({
        key: KEY_FLEX_FILLER,
        title: "",
        dataType: DataType.Internal,
        sortDirection: undefined,
      } as any)
    }

    return columns
  }, [tableColumns, mode, p.rowActions, activeSort, p.showRowNumbers, p.stretchColumns])

  const firstDataColumnKey = useMemo(() => {
    return nativeColumns.find(c => c.key !== KEY_ROW_NUMBER)?.key
  }, [nativeColumns])

  const updateSelectField = (key: any, value: boolean) => {
    if (!p.onSelectionChange) {
      return
    }

    const currentSelected = p.selectedRows || []
    if (value) {
      if (!currentSelected.includes(key)) {
        p.onSelectionChange([...currentSelected, key])
      }
    } else {
      p.onSelectionChange(currentSelected.filter(id => id !== key))
    }
  }

  const updateSelectFieldAll = (value: boolean) => {
    if (!p.onSelectionChange) {
      return
    }

    if (value) {
      const selectableRowIds = p.data
        .filter(d => !p.disabledRows?.includes(d[p.rowKeyField] as string | number))
        .map(d => d[p.rowKeyField] as string | number)
      p.onSelectionChange(selectableRowIds)
    } else {
      p.onSelectionChange([])
    }
  }

  // Resolves whether a specific cell is editable, taking into account per-row callbacks
  // on `column.isEditable`. Used to block ka-table from opening an editor on locked rows.
  const isCellEditable = useCallback(
    (columnKey: string, rowKeyValue: string | number): boolean => {
      // The injected flex filler is an inert spacer column, not in p.columns; keep it
      // non-editable so it never gets the editable hover affordance and a click on it
      // never dispatches OpenEditor (which would close an open editor) in edit mode.
      if (columnKey === KEY_FLEX_FILLER) {
        return false
      }
      const column = p.columns.find(c => c.key === columnKey) as Column | undefined
      if (!column) {
        return true
      }
      if (typeof column.isEditable === "function") {
        const rowData = p.data.find(row => row[p.rowKeyField] === rowKeyValue)
        if (!rowData) {
          return true
        }
        return column.isEditable(rowData)
      }
      return column.isEditable !== false
    },
    [p.columns, p.data, p.rowKeyField],
  )

  const table = useTable({
    onDispatch: d => {
      // Track sort state changes so nativeColumns stays in sync with ka-table's internal state.
      // For SortingMode.Single: Ascend ↔ Descend, clicking a new column starts at Ascend.
      if (d.type === "UpdateSortDirection") {
        const prev = activeSortRef.current
        const next =
          d.columnKey === prev.column
            ? {
                column: d.columnKey,
                direction: prev.direction === SortDirection.Ascend ? SortDirection.Descend : SortDirection.Ascend,
              }
            : { column: d.columnKey, direction: SortDirection.Ascend }
        setActiveSort(next)
        p.onSortChange?.(next.column, next.direction)
      }

      const rowKeyValue = d.rowKeyValue
      if (d.type === "ComponentDidMount") {
        if (p.data && p.data.length > 0 && !p.data.some(d => d[p.rowKeyField])) {
          throw new Error(
            `DataTable: data must contain key defined by property: "rowKeyField" (current value: '${String(p.rowKeyField)}').`,
          )
        }
      }

      if (p.editingMode === EditingMode.Cell) {
        if (d.type === "OpenEditor") {
          // ka-table opens the editor from a click AND from Enter on a focused cell. The click path
          // is neutralized separately via cellText.elementAttributes, but Enter dispatches straight
          // here — so this is the single choke point that blocks editing a locked cell from either
          // path. Close the editor ka-table just opened and bail before tracking edit state.
          if (!isCellEditable(d.columnKey, rowKeyValue)) {
            table.dispatch(closeEditor(rowKeyValue, d.columnKey))
            return
          }
          if (editRowId !== null && (editRowId !== rowKeyValue || editColumnId !== d.columnKey)) {
            table.dispatch(closeEditor(editRowId, editColumnId))
          }
          setEditRowId(rowKeyValue)
          setEditColumnId(d.columnKey)
        }

        if (d.type === "UpdateCellValue") {
          const updatedData = kaPropsUtils.getData(table.props)

          if (p.onChange) {
            p.onChange(updatedData)
          }
        }
      }
    },
  })

  const css = useMemo(
    () =>
      createDataTableStyles(
        cssScope,
        p.fill,
        p.stroke,
        p.cellPaddingSize,
        p.noColumnLines,
        p.borderless,
        p.rowHeight,
        isPaginationOff ? { maxHeight: unpaginatedMaxHeight } : undefined,
      ),
    // Derived primitives, not p.pagination itself: an inline pagination literal is a new
    // object every render and would defeat the memo.
    [
      cssScope,
      p.fill,
      p.stroke,
      p.cellPaddingSize,
      p.noColumnLines,
      p.borderless,
      p.rowHeight,
      isPaginationOff,
      unpaginatedMaxHeight,
    ],
  )

  // ka-table measures its windowing viewport (virtualScrolling.tbodyHeight) once, on the first
  // rendered row, and never re-measures — only scrollTop updates afterwards. If that measurement
  // lands while the table is shorter than its scrollport (e.g. filters trimmed the data below
  // maxHeight), the stale value windows out rows that are actually visible once the table grows
  // back, leaving blank space below the rendered rows. Re-measure on every root resize: the data
  // crossing the scrollport boundary and maxHeight changes both surface as a root resize.
  // offsetHeight of the .ka root is ka-table's own measurement source, kept for consistency.
  //
  // The .ka node is not stable: it does not exist while loadingElement is shown, and the
  // editingMode key on the Table replaces it on mode switches — both must re-run this effect so
  // the observer re-attaches to the current node instead of a missing or detached one.
  const isLoadingElementShown = Boolean(p.loadingElement)
  useEffect(() => {
    if (!virtualScrolling) {
      return
    }
    const root = referenceContainer.current?.querySelector<HTMLElement>(".ka")
    if (!root) {
      return
    }
    const observer = new ResizeObserver(() => {
      const current = table.props.virtualScrolling
      const tbodyHeight = root.offsetHeight
      // The scrollport clamps scrollTop when its content shrinks; read it back so the window
      // is computed from the real scroll position.
      const scrollTop = root.querySelector(".ka-table-wrapper")?.scrollTop ?? current?.scrollTop
      if (current?.tbodyHeight === tbodyHeight && current?.scrollTop === scrollTop) {
        return
      }
      table.dispatch({
        type: ActionType.UpdateVirtualScrolling,
        virtualScrolling: { ...current, enabled: true, tbodyHeight, scrollTop },
      })
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [virtualScrolling, table, p.editingMode, isLoadingElementShown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        referenceContainer.current &&
        !referenceContainer.current.contains(event.target as Node) &&
        p.editingMode === EditingMode.Cell
      ) {
        const isDropdownClick = (event.target as HTMLElement).closest(
          "[data-radix-popper-content-wrapper], [data-radix-dropdown-menu]",
        )
        if (isDropdownClick) {
          return
        }
        if (editRowId !== null) {
          table.dispatch(closeRowEditors(editRowId))
          setEditRowId(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editRowId, p.editingMode, table])

  const showExportButton = p.enableExports?.allowCsv === true
  const hasFilters = mode === "filter" || Children.toArray(p.children).length > 0 || showExportButton

  // Add keyboard navigation support for edit mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (p.mode !== "edit") {
        return
      }

      const tableContainer = referenceContainer.current
      if (!tableContainer?.contains(event.target as HTMLElement)) {
        return
      }

      const focusedElement = document.activeElement
      if (!tableContainer.contains(focusedElement)) {
        return
      }

      // Handle Tab from input elements (seamless editing)
      if (
        event.key === "Tab" &&
        focusedElement &&
        ["input"].includes(focusedElement.tagName.toLocaleLowerCase()) &&
        p.editingMode === EditingMode.Cell &&
        editRowId !== null &&
        editColumnId
      ) {
        event.preventDefault()

        table.dispatch(closeEditor(editRowId, editColumnId))

        const currentCell = new Cell()
        currentCell.columnKey = editColumnId
        currentCell.rowKeyValue = editRowId
        const focused = new Focused()
        focused.cell = currentCell
        table.dispatch(setFocused(focused))
        table.dispatch(event.shiftKey ? moveFocusedLeft({ end: false }) : moveFocusedRight({ end: false }))

        setTimeout(() => {
          const newFocused = table.props.focused
          if (newFocused?.cell) {
            if (isCellEditable(newFocused.cell.columnKey, newFocused.cell.rowKeyValue)) {
              table.dispatch(openEditor(newFocused.cell.rowKeyValue, newFocused.cell.columnKey))
            }
          }
        }, 0)

        return
      }
    }

    const tableContainer = referenceContainer.current
    if (tableContainer) {
      tableContainer.addEventListener("keydown", handleKeyDown, true)
      return () => tableContainer.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [p.mode, p.editingMode, editRowId, editColumnId, table, isCellEditable])

  const exportData = useMemo(() => {
    if (p.onSelectionChange && p.selectedRows && p.selectedRows.length > 0) {
      const selectedSet = new Set(p.selectedRows)
      return p.data.filter(row => selectedSet.has((row as any)[p.rowKeyField]))
    }
    return p.data
  }, [p.data, p.selectedRows, p.onSelectionChange, p.rowKeyField])

  const selectionActive = Boolean(p.onSelectionChange)
  const selectionCount = p.selectedRows?.length ?? 0

  return (
    <>
      <style suppressHydrationWarning>{css}</style>

      <div
        className={cssScope}
        data-mode={mode}
        style={{ display: "flex", width: "100%" }}
        ref={referenceContainer}
        data-playwright-testid={p["data-playwright-testid"]}
      >
        <div className={`tw flex w-full flex-col ${p.loading ? "pointer-events-none opacity-60" : ""}`}>
          <div id="reference-filters" className="tw flex w-full flex-row items-start justify-between">
            <div className="tw flex flex-row flex-wrap items-center gap-4">
              {mode === "filter" ? <SearchInput onDebouncedChange={handleSearchChange} /> : null}
              {Children.toArray(p.children)}
            </div>
            {showExportButton && p.enableExports && (
              <ExportButton
                config={p.enableExports}
                columns={p.columns}
                data={exportData}
                selectionActive={selectionActive}
                selectionCount={selectionCount}
              />
            )}
          </div>

          {hasFilters ? <div id="reference-spacer" className="tw h-4 shrink-0" /> : null}

          <div className="tw flex w-full flex-col">
            <div id="reference-target">
              {p.loadingElement ? (
                p.loadingElement
              ) : (
                <div
                  className="tw flex w-full flex-col"
                  style={{
                    border: p.borderless ? undefined : `1px solid ${computeColor(p.stroke || [Color.Neutral, 100])}`,
                    backgroundColor: computeColor(p.fill || [Color.Transparent]),
                  }}
                >
                  {/* 
                      Force ka-table to remount when switching between cell-editing and readonly modes.
                      This is necessary because ka-table maintains internal state and event handlers that don't 
                      get properly reset when editingMode prop changes dynamically after initial render.
                      Without this key, cells remain editable even after switching from EditingMode.Cell to None.
                    */}
                  {/* Same remount key as the Table below: a remount replaces the scroll wrapper's DOM, so the fades' observers must re-attach to the new nodes. */}
                  <ScrollEdgeFades
                    key={p.editingMode === EditingMode.Cell ? "cell-edit" : "readonly"}
                    suppressLeft={Boolean(p.fixedKeyField)}
                    suppressRight={Boolean(p.rowActions)}
                  >
                    <Table
                      key={p.editingMode === EditingMode.Cell ? "cell-edit" : "readonly"}
                      table={table}
                      columns={nativeColumns as any}
                      data={displayData}
                      rowKeyField={String(p.rowKeyField)}
                      selectedRows={p.selectedRows || []}
                      // SingleRemote makes ka-table skip its client-side sortData for server pages while
                      // header clicks still dispatch UpdateSortDirection — verified against ka-table 12.0.3;
                      // re-check this contract on ka-table upgrades.
                      sortingMode={
                        p.disableSorting
                          ? SortingMode.None
                          : isServerMode
                            ? SortingMode.SingleRemote
                            : SortingMode.Single
                      }
                      editingMode={p.editingMode}
                      virtualScrolling={virtualScrolling}
                      noData={{ text: p.noDataText || "Nothing found" }}
                      searchText={filter}
                      search={({ searchText: searchTextValue, rowData, column }) => {
                        if (column.dataType === DataType.Boolean) {
                          const b = (rowData as any)[column.key]
                          const s = searchTextValue.toLowerCase()

                          return (s === "yes" && b === true) || (s === "no" && b === false)
                        }
                      }}
                      sort={({ column }) => {
                        if (column["sort"]) {
                          return column["sort"](column.sortDirection)
                        }
                      }}
                      childComponents={{
                        headCell: {
                          content: headCellContent => {
                            if (headCellContent.column.key === KEY_ACTIONS) {
                              return <></>
                            }

                            if (headCellContent.column.key === KEY_FLEX_FILLER) {
                              return <></>
                            }

                            if (headCellContent.column.key === KEY_ROW_NUMBER) {
                              return (
                                <span
                                  className={`tw flex justify-end font-semibold text-neutral-700 ${sizeClass(textSize, "xsmall")}`}
                                >
                                  #
                                </span>
                              )
                            }

                            let iconName: string

                            if (headCellContent.column.sortDirection === SortDirection.Ascend) {
                              iconName = "keyboard_arrow_up"
                            } else if (headCellContent.column.sortDirection === SortDirection.Descend) {
                              iconName = "keyboard_arrow_down"
                            } else {
                              iconName = "unfold_more"
                            }

                            const alignmentRight = headCellContent.column.dataType === DataType.Number
                            const firstColumn = headCellContent.column.key === firstDataColumnKey

                            const headCellContentAsColumn = headCellContent.column as Column
                            // In server pagination the table never sorts data itself, so header clicks only have
                            // an effect through onSortChange — without it a clickable header would be an inert no-op.
                            const serverSortInert = isServerMode && !p.onSortChange
                            const allowSort =
                              !p.disableSorting &&
                              mode !== "edit" &&
                              headCellContentAsColumn.dataType !== DataType.Status &&
                              headCellContentAsColumn.disableSort !== true &&
                              !serverSortInert

                            const fullTitle = headCellContent.column.title
                            const titleSizeCls = sizeClass(textSize, "xsmall")
                            const ellipsisCls = p.ellipsisColumnNames
                              ? "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis"
                              : "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"

                            const headerTitle = (
                              <span className={`tw font-semibold text-neutral-700 ${titleSizeCls} ${ellipsisCls}`}>
                                {fullTitle}
                              </span>
                            )

                            const headerJustify = alignmentRight ? "justify-end" : "justify-start"
                            const headerContent = (
                              <div className={`tw flex items-center min-w-0 ${headerJustify}`}>
                                {allowSort ||
                                (headCellContentAsColumn.sort &&
                                  headCellContentAsColumn.disableSort !== true &&
                                  !serverSortInert) ? (
                                  <a
                                    className="tw flex min-w-0 cursor-pointer items-center gap-0.5 select-none"
                                    onClick={() => table.updateSortDirection(headCellContent.column.key)}
                                  >
                                    {headerTitle}
                                    <span className="tw shrink-0">
                                      <Icon medium name={iconName} fill={[Color.Neutral, 700]} />
                                    </span>
                                  </a>
                                ) : (
                                  headerTitle
                                )}
                              </div>
                            )

                            const tooltipText = p.ellipsisColumnNames
                              ? fullTitle
                              : headCellContentAsColumn.headerTooltip

                            return (
                              <div className="tw flex w-full items-center gap-1">
                                {(mode === "simple" || mode === "filter") && p.onSelectionChange && firstColumn ? (
                                  <InputCheckbox
                                    size="small"
                                    color={Color.Neutral}
                                    value={
                                      selectedFields === totalSelectableFields && totalSelectableFields > 0
                                        ? true
                                        : selectedFields === 0
                                          ? false
                                          : "indeterminate"
                                    }
                                    onChange={value => updateSelectFieldAll(value)}
                                  />
                                ) : null}

                                <span className={`tw flex w-full flex-1 ${headerJustify}`}>
                                  {tooltipText ? (
                                    <Tooltip trigger={headerContent}>
                                      <span className="tw text-xs text-neutral-700">{tooltipText}</span>
                                    </Tooltip>
                                  ) : (
                                    headerContent
                                  )}
                                </span>
                              </div>
                            )
                          },

                          elementAttributes: headCellElementAttributes => {
                            const column = headCellElementAttributes.column as Column

                            const classNames: string[] = []
                            if (p.fixedKeyField === column.key) {
                              classNames.push("override-ka-fixed-left")
                            }
                            if (column.key === KEY_ACTIONS) {
                              classNames.push("override-ka-fixed-right")
                            }
                            if (resolveColumnSizing(column) === "fit") {
                              classNames.push("ka-cell-fit")
                            }
                            if (column.key === KEY_FLEX_FILLER) {
                              classNames.push("ka-cell-flex-filler")
                            }

                            const { width, minWidth, maxWidth } = calculateColumnWidth(column)

                            return {
                              className: classNames.join(" ") || undefined,
                              style: { width, minWidth, maxWidth },
                            }
                          },
                        },

                        cellText: {
                          // ka-table merges the attributes returned here over its own defaults for the
                          // cell-text element. When a per-row `isEditable` callback locks this cell,
                          // returning a no-op onClick replaces ka-table's default handler (which
                          // dispatches OpenEditor), so clicking no longer opens the editor. The
                          // keyboard/Enter path is blocked separately in onDispatch.
                          elementAttributes: cellTextProps => {
                            if (!isCellEditable(cellTextProps.column.key, cellTextProps.rowKeyValue)) {
                              return { onClick: () => {} }
                            }
                            return {}
                          },
                          content: cellTextContent => {
                            if (cellTextContent.column.key === KEY_FLEX_FILLER) {
                              return <span className="tw block" />
                            }

                            if (cellTextContent.column.key === KEY_ROW_NUMBER) {
                              const sortedData = kaPropsUtils.getData(table.props)
                              const rowIndex = sortedData.findIndex(
                                (d: any) => d[p.rowKeyField] === cellTextContent.rowKeyValue,
                              )
                              const pageOffset = isServerMode
                                ? 0
                                : paginationConfig.pageIndex * paginationConfig.pageSize

                              return (
                                <span
                                  className={`tw flex justify-end text-neutral-500 ${sizeClass(textSize, "small")}`}
                                >
                                  {rowIndex + 1 + pageOffset}
                                </span>
                              )
                            }

                            if (cellTextContent.column.key === KEY_ACTIONS && p.rowActions) {
                              return (
                                <div className="tw flex items-center justify-end gap-1">
                                  {Children.toArray(p.rowActions(cellTextContent.rowData))}
                                </div>
                              )
                            } else {
                              const column = cellTextContent.column as Column

                              const alignmentRight = column.dataType === DataType.Number
                              const firstColumn = column.key === firstDataColumnKey

                              const text = formatValue(
                                cellTextContent.value?.toString(),
                                column.dataType || DataType.String,
                                column.placeholder,
                              )

                              const tooltip = column.tooltip as Column["tooltip"]
                              const tooltipTextCls = `tw text-neutral-700 ${sizeClass(textSize, "small")}`

                              let tooltipContent

                              const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING
                              if (typeof tooltip === "boolean" && text !== emptyString) {
                                tooltipContent = <span className={tooltipTextCls}>{text}</span>
                              } else if (typeof tooltip === "function") {
                                tooltipContent = tooltip(cellTextContent.rowData)

                                if (typeof tooltipContent === "string") {
                                  tooltipContent = <span className={tooltipTextCls}>{tooltipContent}</span>
                                }
                              }

                              // When showTooltipIcon is set, render the info icon inline with the cell content
                              // (next to it, before any end adornment) as an indicator. In this case the tooltip
                              // is scoped to the title content + icon inside OptimizedCell (not the whole cell),
                              // so it doesn't overlap a separate tooltip on an end adornment in the same cell.
                              const showTooltipIconWrap =
                                !!tooltipContent &&
                                column.dataType !== DataType.Status &&
                                column.dataType !== DataType.ProgressIndicator &&
                                column.dataType !== DataType.Icon &&
                                column.showTooltipIcon === true

                              const tooltipIcon = showTooltipIconWrap ? (
                                <Icon name="info" small fill={[Color.Neutral, 200]} />
                              ) : undefined

                              const footerElement =
                                typeof column.footer === "function" ? column.footer(cellTextContent.rowData) : undefined

                              let output: ReactNode
                              if (column.dataType === DataType.ProgressIndicator) {
                                output = <CellProgressIndicator {...cellTextContent} textSize={p.textSize} />
                              } else if (column.dataType === DataType.Status) {
                                output = <CellStatus {...cellTextContent} textSize={p.textSize} />
                              } else if (column.dataType === DataType.Icon) {
                                output = <CellIcon {...cellTextContent} textSize={p.textSize} />
                              } else {
                                output = (
                                  <OptimizedCell
                                    {...cellTextContent}
                                    column={column}
                                    firstColumn={firstColumn}
                                    tooltipContent={tooltipContent}
                                    tooltipIcon={tooltipIcon}
                                    textSize={p.textSize}
                                  />
                                )
                              }

                              const customCellRendererElement =
                                p.customCellRenderer && typeof p.customCellRenderer === "function"
                                  ? p.customCellRenderer(cellTextContent)
                                  : null

                              const justify = alignmentRight ? "justify-end" : "justify-start"

                              // When the info icon is shown, OptimizedCell scopes the tooltip to the title content +
                              // icon itself, so we must not also wrap the whole cell here — that would re-trigger the
                              // cell tooltip over an end adornment that has its own tooltip (showing two at once).
                              // List/link cells render markup that doesn't carry the tooltip, so they keep the wrap.
                              const tooltipOwnedByContent =
                                showTooltipIconWrap && column.dataType !== DataType.List && !column.link
                              const main =
                                tooltipContent && !tooltipOwnedByContent ? (
                                  <Tooltip trigger={output}>{tooltipContent}</Tooltip>
                                ) : (
                                  output
                                )

                              const cellStyleValue =
                                typeof column.cellStyle === "function"
                                  ? column.cellStyle(cellTextContent.rowData)
                                  : column.cellStyle

                              const inner = customCellRendererElement ? (
                                customCellRendererElement
                              ) : footerElement ? (
                                <span className="tw flex w-full flex-col py-0.5 gap-0.5">
                                  <span className={`tw flex w-full ${justify}`}>{main}</span>
                                  <span className={`tw flex w-full ${justify}`} style={cellStyleValue}>
                                    {footerElement}
                                  </span>
                                </span>
                              ) : (
                                main
                              )

                              return (
                                <span className="tw flex w-full items-center gap-1">
                                  {(mode === "simple" || mode === "filter") && p.onSelectionChange && firstColumn ? (
                                    <InputCheckbox
                                      size="small"
                                      color={Color.Neutral}
                                      disabled={p.disabledRows?.includes(cellTextContent.rowKeyValue) ?? false}
                                      value={p.selectedRows?.includes(cellTextContent.rowKeyValue) ?? false}
                                      onChange={value => {
                                        updateSelectField(cellTextContent.rowKeyValue, value)
                                      }}
                                    />
                                  ) : null}

                                  <span className={`tw flex w-full flex-1 ${justify}`}>{inner}</span>
                                </span>
                              )
                            }
                          },
                        },

                        cellEditor: {
                          content: cellEditorContent => {
                            const column = cellEditorContent.column as Column
                            switch (column.dataType) {
                              case DataType.ProgressIndicator:
                                return <CellProgressIndicator {...cellEditorContent} textSize={p.textSize} />
                              case DataType.List:
                                return <CellInputCombobox {...cellEditorContent} />
                              case DataType.Status:
                                return <CellStatus {...cellEditorContent} textSize={p.textSize} />
                              case DataType.Boolean:
                                return <CellInputCheckbox {...cellEditorContent} />
                              case DataType.Date:
                                return <CellInputTextDate {...cellEditorContent} />
                              case DataType.Number:
                              case DataType.String:
                                return (
                                  <CellInputTextSingle
                                    {...cellEditorContent}
                                    autoFocus={p.editingMode === EditingMode.Cell}
                                  />
                                )
                              default:
                                return null
                            }
                          },
                        },

                        cell: {
                          elementAttributes: cellElementAttributes => {
                            const column = cellElementAttributes.column as Column
                            const id = (cellElementAttributes?.rowData as any)?.id
                              ? `cell-${column.key}-${(cellElementAttributes?.rowData as any)?.id}`
                              : undefined
                            const classNames: string[] = []

                            if (p.fixedKeyField === column.key) {
                              classNames.push("override-ka-fixed-left")
                            }

                            if (column.key === KEY_ACTIONS) {
                              classNames.push("override-ka-fixed-right")
                            }

                            if (column.dataType === DataType.Icon) {
                              classNames.push("ka-cell-icon")
                            }

                            if (resolveColumnSizing(column) === "fit") {
                              classNames.push("ka-cell-fit")
                            }

                            if (column.key === KEY_FLEX_FILLER) {
                              classNames.push("ka-cell-flex-filler")
                            }

                            const rowKeyValue = (cellElementAttributes?.rowData as any)?.[p.rowKeyField] as
                              | string
                              | number
                              | undefined
                            const editableForThisRow =
                              rowKeyValue !== undefined
                                ? isCellEditable(column.key, rowKeyValue)
                                : column.isEditable !== false

                            if (mode === "edit" && p.editingMode === EditingMode.Cell && editableForThisRow) {
                              classNames.push("ka-cell-editable")
                            }

                            const { width, minWidth, maxWidth } = calculateColumnWidth(column)

                            const fillColor =
                              typeof column.fill === "function"
                                ? column.fill(cellElementAttributes.rowData)
                                : column.fill
                            const backgroundColor = fillColor
                              ? computeColor([fillColor, fillColor === Color.Neutral ? 50 : 100])
                              : undefined

                            const dimmed = p.dimRow?.(cellElementAttributes.rowData as TData) ?? false

                            return {
                              id: id,
                              className: classNames.join(" "),
                              tabIndex: p.mode === "edit" && editableForThisRow ? -1 : undefined,

                              style: {
                                width: width,
                                minWidth: minWidth,
                                maxWidth: maxWidth,
                                backgroundColor,
                                opacity: dimmed ? DIMMED_ROW_OPACITY : undefined,
                              },
                            }
                          },
                        },
                      }}
                    />
                  </ScrollEdgeFades>

                  {showPagination ? (
                    <DataTablePagination
                      pageIndex={paginationConfig.pageIndex}
                      pageSize={paginationConfig.pageSize}
                      totalCount={paginationConfig.totalCount}
                      pageSizeOptions={paginationConfig.pageSizeOptions}
                      onPageChange={paginationConfig.onPageChange}
                      onPageSizeChange={paginationConfig.onPageSizeChange}
                      textSize={p.textSize}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
