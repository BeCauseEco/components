"use client"

import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { EditingMode, InsertRowPosition, SortDirection, SortingMode, Table, useTable } from "ka-table"
import {
  closeEditor,
  closeRowEditors,
  deleteRow,
  openEditor,
  setFocused,
  moveFocusedRight,
  moveFocusedLeft,
} from "ka-table/actionCreators"
import { Cell } from "ka-table/Models/Cell"
import { Focused } from "ka-table/Models/Focused"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { Spacer } from "@new/Stack/Spacer"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Color } from "@new/Color"
import { Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import styled from "@emotion/styled"
import { Children, ReactNode, useCallback, useEffect, useId, useRef, useState, useMemo } from "react"
import _debounce from "lodash/debounce"
import { useReactToPrint } from "react-to-print"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { Divider } from "@new/Divider/Divider"
import { kaPropsUtils } from "ka-table/utils"
import { Alert } from "@new/Alert/Alert"
import { useResizeObserver } from "usehooks-ts"
import { Tooltip } from "@new/Tooltip/Tooltip"

// Import from our new modular structure
import { DataTableProps, DataType, Column } from "./types"
import { createNewRow, formatValue, csv } from "./utils"
import { createDataTableStyles } from "./styles"
import { ActionEdit, ActionSaveCancel } from "./internal/ActionComponents"
import { CellInputTextSingle, CellInputTextDate, CellInputCheckbox, CellInputCombobox } from "./internal/CellEditors"
import { CellProgressIndicator, CellStatus, CellIcon } from "./internal/CellRenderers"
import { KEY_DRAG, KEY_ACTIONS_EDIT, KEY_ACTIONS, TABLE_CELL_EMPTY_STRING } from "./internal/constants"
import { OptimizedCell } from "./internal/OptimizedCellComponents"

// Re-export for backward compatibility
export { SortDirection } from "ka-table"
export { DataType } from "./types"
export type { DataTableProps, Column } from "./types"

const CellHeadLink = styled.a({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
})

export const DataTable = (p: DataTableProps) => {
  const cssScope = useId().replace(/:/g, "datatable")
  const referenceContainer = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // Helper to get text size props for Text components
  const getTextSizeProps = (
    defaultSize: "xxtiny" | "xtiny" | "tiny" | "xsmall" | "small" | "medium" | "large" = "small",
  ) => {
    const size = p.textSize || defaultSize
    return { [size]: true }
  }

  // Optimization 5: Performance monitoring hook for development
  const usePerformanceMonitoring = (label: string, deps: any[]) => {
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        const startTime = performance.now()
        return () => {
          const endTime = performance.now()
          const duration = endTime - startTime
          if (duration > 16) {
            // Log if render takes more than one frame (16ms)
            console.log(`⚡ DataTable ${label}: ${duration.toFixed(2)}ms`)
          }
        }
      }
    }, deps)
  }

  // Optimization 4: Debounced resize handler to reduce performance impact
  const debouncedResizeHandler = useMemo(
    () =>
      _debounce((size: { width?: number; height?: number }) => {
        if (p.mode === "edit" && p.editingMode !== EditingMode.Cell) {
          return
        }

        const containerWidth = size.width || 0
        const containerHeight = size.height || 0

        if (referenceContainer.current && containerWidth > 0) {
          setContainerWidth(Math.floor(containerWidth - 16 - 2))
        }

        if (referenceContainer.current && containerHeight > 0) {
          // Cache DOM queries
          const filtersElement = referenceContainer.current.querySelector(`#reference-filters`)
          const spacerElement = referenceContainer.current.querySelector(`#reference-spacer`)
          const targetElements = referenceContainer.current.querySelectorAll(`#reference-target`)

          if (filtersElement && spacerElement && targetElements.length > 0) {
            const filtersHeight = filtersElement.clientHeight || 0
            const spacerHeight = spacerElement.clientHeight || 0
            const newHeight = `${Math.ceil(containerHeight - filtersHeight - spacerHeight)}px`

            targetElements.forEach(target => {
              const t = target as HTMLElement
              if (t) {
                t.style.height = newHeight
              }
            })
          }
        }
      }, 100), // 100ms debounce
    [p.mode, p.editingMode],
  )

  useResizeObserver({
    ref: referenceContainer as React.RefObject<HTMLElement>,
    box: "border-box",
    onResize: debouncedResizeHandler,
  })

  const [filter, setFilter] = useState("")
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [editColumnId, setEditColumnId] = useState<string>("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [dataTemp, setDataTemp] = useState<DataTableProps["data"]>([])

  // Optimization 2: Memoize selected fields count
  const selectedFields = useMemo(() => {
    if (!p.selectKeyField) {
      return 0
    }
    return p.data.filter(d => p.selectKeyField && d[p.selectKeyField]).length
  }, [p.data, p.selectKeyField])

  // Memoize total selectable fields count
  const totalSelectableFields = useMemo(() => {
    if (!p.selectKeyField) {
      return 0
    }
    if (p.selectDisabledField === undefined) {
      return p.data.length
    }
    return p.data.filter(d => p.selectDisabledField && !d[p.selectDisabledField]).length
  }, [p.data, p.selectKeyField, p.selectDisabledField])

  // Optimization 1: Memoize column processing
  const nativeColumns = useMemo(() => {
    const columns = p.columns.map(c => {
      const column = c as Column

      const sortDirection = p.mode !== "edit" && column.key === p.defaultSortColumn ? p.defaultSortDirection : undefined

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
        sortDirection: sortDirection,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        explodeWidth: column.explodeWidth,
        preventContentCollapse: column.preventContentCollapse,
        isEditable: column.isEditable,
        endAdornment: column.endAdornment,
        startAdornment: column.startAdornment,
        fill: column.fill,
        placeholder: column.placeholder,
      }
    })

    // Add action columns if needed
    if (p.mode === "edit" && p.editingMode !== EditingMode.Cell) {
      columns.push({
        key: KEY_ACTIONS_EDIT,
        title: "",
        dataType: DataType.Internal,
        sortDirection: undefined,
      } as any)
    } else if (p.rowActions) {
      columns.push({
        key: KEY_ACTIONS,
        title: "",
        dataType: DataType.Internal,
        sortDirection: undefined,
      } as any)
    }

    return columns
  }, [p.columns, p.mode, p.editingMode, p.rowActions, p.defaultSortColumn, p.defaultSortDirection])

  const getRowById = useCallback(
    (id: any) => {
      return p.data.find(r => r[p.rowKeyField] === id)
    },
    [p.data, p.rowKeyField],
  )

  const updateSelectField = useCallback(
    (key: any, value: boolean) => {
      if (p.selectKeyField === undefined) {
        return
      }

      const d = [...p.data]
      const row = d.find(r => r[p.rowKeyField] === key)

      if (!row) {
        return
      }
      row[p.selectKeyField] = value

      if (p.onChange) {
        p.onChange(d)
      }

      if (p.onChangeRow) {
        p.onChangeRow(row)
      }

      // Selected fields will be recalculated automatically via useMemo
    },
    [p.data, p.selectKeyField, p.rowKeyField, p.onChange, p.onChangeRow],
  )

  const updateSelectFieldAll = useCallback(
    (value: boolean) => {
      if (p.selectKeyField === undefined) {
        return
      }

      const d = [...p.data]

      d.filter(d => p.selectDisabledField === undefined || !d[p.selectDisabledField]).forEach(row => {
        if (p.selectKeyField) {
          row[p.selectKeyField] = value
        }
      })

      if (p.onChange) {
        p.onChange(d)
      }

      // Selected fields will be recalculated automatically via useMemo
    },
    [p.data, p.selectKeyField, p.selectDisabledField, p.onChange],
  )

  const table = useTable({
    onDispatch: d => {
      const rowKeyValue = d.rowKeyValue
      if (d.type === "ComponentDidMount") {
        if (p.data && p.data.length > 0 && !p.data.some(d => d[p.rowKeyField])) {
          throw new Error(
            `DataTable: data must contain key defined by property: "rowKeyField" (current value: '${p.rowKeyField}').`,
          )
        }
      }

      if (p.editingMode === EditingMode.Cell) {
        if (d.type === "OpenEditor") {
          if (editRowId !== null && (editRowId !== rowKeyValue || editColumnId !== d.columnKey)) {
            table.dispatch(closeEditor(editRowId, editColumnId))
          }
          setEditRowId(rowKeyValue)
          setEditColumnId(d.columnKey)
          setDataTemp(p.data)
        }

        if (d.type === "UpdateCellValue") {
          const updatedData = kaPropsUtils.getData(table.props)

          setDataTemp(updatedData)

          if (p.onChange) {
            p.onChange(updatedData)
          }
        }
        return
      }

      if (d.type === "OpenRowEditors") {
        setEditRowId(d.rowKeyValue)
        setDataTemp(p.data)
      }

      if (d.type === "ReorderRows") {
        setDataTemp(kaPropsUtils.getData(table.props))
      }

      if (d.type === "CloseRowEditors") {
        setEditRowId(null)

        if (p.onChange) {
          p.onChange(dataTemp)
        }

        table.updateData(dataTemp)
      }

      if (d.type === "SaveRowEditors" || d.type === "ReorderRows" || d.type === "InsertRow" || d.type === "DeleteRow") {
        const data = kaPropsUtils.getData(table.props)

        if (d.type !== "ReorderRows") {
          setEditRowId(null)
        }

        if (p.onChange) {
          p.onChange(data)
        }

        if (p.onChangeRow) {
          if (d.type === "InsertRow") {
            p.onChangeRow(data[data.length - 1])
          } else {
            p.onChangeRow(data.filter(d => d.id === rowKeyValue)?.[0])
          }
        }

        setDeleteId(null)
      }
    },
  })

  const referencePrint = useRef<HTMLDivElement>(null)
  const print = useReactToPrint({ contentRef: referencePrint, documentTitle: p.exportName })

  const css = createDataTableStyles(cssScope, p.fill, p.stroke, p.cellPaddingSize)

  // Monitor performance of key operations
  usePerformanceMonitoring("render", [p.data.length, p.columns.length])
  usePerformanceMonitoring("column processing", [nativeColumns])
  usePerformanceMonitoring("data selection", [selectedFields, totalSelectableFields])

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
            table.dispatch(openEditor(newFocused.cell.rowKeyValue, newFocused.cell.columnKey))
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
  }, [p.mode, p.editingMode, editRowId, editColumnId, table])

  const hasFilters = p.mode === "filter" || Children.toArray(p.children).length > 0 || !p.exportDisable

  return (
    <>
      <style suppressHydrationWarning>{css}</style>

      <div
        className={cssScope}
        data-mode={p.mode}
        style={{ display: "flex", width: "100%", height: "100%" }}
        ref={referenceContainer}
      >
        <Stack vertical hug loading={p.loading}>
          <Align left hug="height" horizontal id="reference-filters">
            <Stack hug horizontal>
              <Align left horizontal wrap>
                {p.mode === "filter" ? (
                  <InputTextSingle
                    iconNameLeft="search"
                    value={filter}
                    width="fixed"
                    size="large"
                    placeholder="Search"
                    onChange={v => setFilter(v)}
                    color={Color.Neutral}
                  />
                ) : (
                  <></>
                )}
                {Children.toArray(p.children)
                  .filter(child => !!child)
                  .map(child => child)}
              </Align>

              <Align bottomRight horizontal hug>
                {!p.exportDisable && !p.loadingElement ? (
                  <>
                    <Spacer large />
                    <InputButtonIconTertiary
                      size="large"
                      iconName="csv"
                      title="Export to CSV"
                      onClick={() => csv(p.data, p.columns as Column[])}
                    />

                    <InputButtonIconTertiary
                      size="large"
                      iconName="print"
                      title="Print table contents"
                      onClick={() => print()}
                    />
                  </>
                ) : (
                  <></>
                )}
              </Align>
            </Stack>
          </Align>

          {hasFilters ? <Spacer medium id="reference-spacer" /> : <></>}

          <Align left vertical>
            <div id="reference-target" ref={referencePrint}>
              {p.loadingElement ? (
                p.loadingElement
              ) : (
                <Stack vertical hug stroke={p.stroke || [Color.Neutral, 100]} fill={p.fill || [Color.Transparent]}>
                  <Align topLeft vertical>
                    <Table
                      table={table}
                      columns={nativeColumns as any}
                      data={p.data}
                      rowKeyField={p.rowKeyField}
                      sortingMode={p.disableSorting ? SortingMode.None : SortingMode.Single}
                      editingMode={p.editingMode}
                      rowReordering={p.mode === "edit" && p.editingMode !== EditingMode.Cell}
                      noData={{ text: "Nothing found" }}
                      searchText={filter}
                      virtualScrolling={p.mode !== "edit" && p.virtualScrolling ? { enabled: true } : undefined}
                      search={({ searchText: searchTextValue, rowData, column }) => {
                        if (column.dataType === DataType.Boolean) {
                          const b = rowData[column.key]
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
                        tableWrapper: {
                          elementAttributes: () => {
                            if (p.mode !== "edit" && p.virtualScrolling) {
                              return {
                                className: "override-ka-virtual",
                              }
                            }

                            if (p.mode === "edit" && p.editingMode !== EditingMode.Cell) {
                              return {
                                className: "override-ka-reorder",
                              }
                            }
                          },
                        },

                        dataRow: {
                          elementAttributes: dataRowElementAttributes => {
                            if (
                              dataRowElementAttributes.rowKeyValue === editRowId &&
                              p.editingMode !== EditingMode.Cell
                            ) {
                              return {
                                className: "override-ka-editing-row",
                              }
                            }
                          },
                        },

                        headCell: {
                          content: headCellContent => {
                            if (
                              headCellContent.column.key === KEY_DRAG ||
                              headCellContent.column.key === KEY_ACTIONS_EDIT ||
                              headCellContent.column.key === KEY_ACTIONS
                            ) {
                              return <></>
                            }

                            let iconName = ""

                            if (headCellContent.column.sortDirection === SortDirection.Ascend) {
                              iconName = "keyboard_arrow_up"
                            } else if (headCellContent.column.sortDirection === SortDirection.Descend) {
                              iconName = "keyboard_arrow_down"
                            } else {
                              iconName = "unfold_more"
                            }

                            const alignmentRight = headCellContent.column.dataType === DataType.Number
                            const firstColumn = headCellContent.column.key === nativeColumns[0].key

                            const headCellContentAsColumn = headCellContent.column as Column
                            const allowSort =
                              !p.disableSorting &&
                              p.mode !== "edit" &&
                              headCellContentAsColumn.dataType !== DataType.Status

                            return (
                              <Stack hug horizontal>
                                {(p.mode === "simple" || p.mode === "filter") && p.selectKeyField && firstColumn ? (
                                  <>
                                    <Align left horizontal hug>
                                      <InputCheckbox
                                        size="small"
                                        color={Color.Neutral}
                                        value={
                                          selectedFields === totalSelectableFields
                                            ? true
                                            : selectedFields === 0
                                              ? false
                                              : "indeterminate"
                                        }
                                        onChange={value => updateSelectFieldAll(value)}
                                      />
                                    </Align>

                                    <Spacer xsmall />
                                  </>
                                ) : (
                                  <></>
                                )}

                                <Align horizontal left={!alignmentRight} right={alignmentRight}>
                                  {allowSort || headCellContentAsColumn.sort ? (
                                    <CellHeadLink onClick={() => table.updateSortDirection(headCellContent.column.key)}>
                                      <Text fill={[Color.Neutral, 700]} {...getTextSizeProps("xsmall")}>
                                        <b>{headCellContent.column.title}</b>
                                      </Text>

                                      <Spacer tiny />

                                      <Icon medium name={iconName} fill={[Color.Neutral, 700]} />
                                    </CellHeadLink>
                                  ) : (
                                    <Text fill={[Color.Neutral, 700]} {...getTextSizeProps("xsmall")}>
                                      <b>{headCellContent.column.title}</b>
                                    </Text>
                                  )}
                                </Align>
                              </Stack>
                            )
                          },

                          elementAttributes: headCellElementAttributes => {
                            const column = headCellElementAttributes.column as Column

                            if (p.fixedKeyField === column.key) {
                              return { className: "override-ka-fixed-left" }
                            }

                            if (
                              column.key === KEY_DRAG ||
                              column.key === KEY_ACTIONS_EDIT ||
                              column.key === KEY_ACTIONS
                            ) {
                              return { className: "override-ka-fixed-right" }
                            }
                          },
                        },

                        cellText: {
                          content: cellTextContent => {
                            if (cellTextContent.column.key === KEY_ACTIONS_EDIT && p.editingMode !== EditingMode.Cell) {
                              return (
                                <Stack horizontal hug>
                                  <Align horizontal right>
                                    <InputButtonIconTertiary
                                      size="small"
                                      iconName="delete"
                                      onClick={() => setDeleteId(cellTextContent.rowKeyValue)}
                                      disabled={editRowId !== null}
                                      destructive
                                    />

                                    <ActionEdit {...cellTextContent} disabled={editRowId !== null} />
                                  </Align>
                                </Stack>
                              )
                            } else if (cellTextContent.column.key === KEY_ACTIONS && p.rowActions) {
                              const actionElements: ReactNode[] = []

                              Children.toArray(p.rowActions(cellTextContent.rowData)).forEach(r => {
                                actionElements.push(r)
                                actionElements.push(<Spacer xsmall />)
                              })

                              actionElements.pop()

                              return (
                                <Stack horizontal hug>
                                  <Align horizontal right>
                                    {actionElements}
                                  </Align>
                                </Stack>
                              )
                            } else {
                              const column = cellTextContent.column as Column

                              const alignmentRight = column.dataType === DataType.Number
                              const firstColumn = column.key === nativeColumns[0].key

                              const text = formatValue(
                                cellTextContent.value?.toString(),
                                column.dataType || DataType.String,
                                column.placeholder,
                              )

                              const tooltip = column.tooltip as Column["tooltip"]

                              let tooltipElement

                              const emptyString = column.placeholder || TABLE_CELL_EMPTY_STRING
                              if (typeof tooltip === "boolean" && text !== emptyString) {
                                tooltipElement = (
                                  <Align horizontal left>
                                    <Text {...getTextSizeProps()} fill={[Color.Neutral, 700]} wrap>
                                      {text}
                                    </Text>
                                  </Align>
                                )
                              } else if (typeof tooltip === "function") {
                                tooltipElement = tooltip(cellTextContent.rowData)

                                if (typeof tooltipElement === "string") {
                                  tooltipElement = (
                                    <Align horizontal left>
                                      <Text {...getTextSizeProps()} fill={[Color.Neutral, 700]} wrap>
                                        {tooltipElement}
                                      </Text>
                                    </Align>
                                  )
                                }
                              }

                              let output = <></>

                              if (column.dataType === DataType.ProgressIndicator) {
                                output = <CellProgressIndicator {...cellTextContent} textSize={p.textSize} />
                              } else if (column.dataType === DataType.Status) {
                                output = <CellStatus {...cellTextContent} textSize={p.textSize} />
                              } else if (column.dataType === DataType.Icon) {
                                output = <CellIcon {...cellTextContent} textSize={p.textSize} />
                              } else {
                                // Use optimized cell component for regular cells
                                output = (
                                  <OptimizedCell
                                    {...cellTextContent}
                                    column={column}
                                    firstColumn={firstColumn}
                                    tooltipElement={tooltipElement}
                                    textSize={p.textSize}
                                  />
                                )
                              }

                              const DEPRICATED_customCellRendererElement =
                                p.DEPRICATED_customCellRenderer && typeof p.DEPRICATED_customCellRenderer === "function"
                                  ? p.DEPRICATED_customCellRenderer(cellTextContent)
                                  : null

                              return (
                                <Stack hug horizontal>
                                  {p.mode === "edit" && firstColumn && p.editingMode !== EditingMode.Cell ? (
                                    <Align left horizontal hug>
                                      <Icon name="drag_indicator" medium fill={[Color.Neutral, 700]} />

                                      <Spacer xsmall />
                                    </Align>
                                  ) : (
                                    <></>
                                  )}

                                  {(p.mode === "simple" || p.mode === "filter") && p.selectKeyField && firstColumn ? (
                                    <>
                                      <Align left horizontal hug>
                                        <InputCheckbox
                                          size="small"
                                          color={Color.Neutral}
                                          disabled={
                                            p.selectDisabledField
                                              ? getRowById(cellTextContent.rowKeyValue)?.[p.selectDisabledField]
                                              : false
                                          }
                                          value={getRowById(cellTextContent.rowKeyValue)?.[p.selectKeyField] ?? false}
                                          onChange={value => {
                                            updateSelectField(cellTextContent.rowKeyValue, value)
                                          }}
                                        />
                                      </Align>

                                      <Spacer xsmall />
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  <Align left={!alignmentRight} right={alignmentRight} horizontal>
                                    {DEPRICATED_customCellRendererElement ? (
                                      DEPRICATED_customCellRendererElement
                                    ) : tooltipElement ? (
                                      <Tooltip
                                        trigger={
                                          column.dataType !== DataType.Status &&
                                          column.dataType !== DataType.ProgressIndicator &&
                                          column.showTooltipIcon === true ? (
                                            <Align horizontal center hug>
                                              {output}
                                              <Spacer xsmall />
                                              <Icon name="info" small fill={[Color.Neutral, 200]} />
                                            </Align>
                                          ) : (
                                            output
                                          )
                                        }
                                      >
                                        {tooltipElement}
                                      </Tooltip>
                                    ) : (
                                      output
                                    )}
                                  </Align>
                                </Stack>
                              )
                            }
                          },
                        },

                        cellEditor: {
                          content: cellEditorContent => {
                            const firstColumn = cellEditorContent.column.key === nativeColumns[0].key
                            return (
                              <Stack hug horizontal>
                                {p.mode === "edit" && firstColumn && p.editingMode !== EditingMode.Cell ? (
                                  <Align left horizontal hug>
                                    <Icon name="drag_indicator" medium fill={[Color.Neutral, 700]} />

                                    <Spacer xsmall />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {(cellEditorContent.column as Column).dataType === DataType.ProgressIndicator ? (
                                  <Align left horizontal>
                                    <CellProgressIndicator {...cellEditorContent} textSize={p.textSize} />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {(cellEditorContent.column as Column).dataType === DataType.List ? (
                                  <Stack vertical hug>
                                    <CellInputCombobox {...cellEditorContent} />
                                  </Stack>
                                ) : (
                                  <></>
                                )}

                                {(cellEditorContent.column as Column).dataType === DataType.Status ? (
                                  <Align left horizontal>
                                    <CellStatus {...cellEditorContent} textSize={p.textSize} />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {cellEditorContent.column.dataType === DataType.Boolean ? (
                                  <Align left horizontal>
                                    <CellInputCheckbox {...cellEditorContent} />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {cellEditorContent.column.dataType === DataType.Date ? (
                                  <Align left horizontal>
                                    <CellInputTextDate {...cellEditorContent} />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {cellEditorContent.column.dataType === DataType.Number ||
                                cellEditorContent.column.dataType === DataType.String ? (
                                  <Align left horizontal>
                                    <CellInputTextSingle
                                      {...cellEditorContent}
                                      autoFocus={p.editingMode === EditingMode.Cell}
                                    />
                                  </Align>
                                ) : (
                                  <></>
                                )}

                                {cellEditorContent.column.key === KEY_ACTIONS_EDIT ? (
                                  <Align left horizontal>
                                    <ActionSaveCancel {...cellEditorContent} />
                                  </Align>
                                ) : (
                                  <></>
                                )}
                              </Stack>
                            )
                          },
                        },

                        cell: {
                          elementAttributes: cellElementAttributes => {
                            const column = cellElementAttributes.column as Column
                            const id = cellElementAttributes?.rowData?.id
                              ? `cell-${column.key}-${cellElementAttributes?.rowData?.id}`
                              : undefined
                            const classNames: string[] = []

                            if (p.fixedKeyField === column.key) {
                              classNames.push("override-ka-fixed-left")
                            }

                            if (column.key === KEY_ACTIONS_EDIT || column.key === KEY_ACTIONS) {
                              classNames.push("override-ka-fixed-right")
                            }

                            let minWidth: number | string = "auto"
                            let maxWidth: number | string = "auto"

                            if (column.minWidth) {
                              if (typeof column.minWidth === "string" && column.minWidth.endsWith("%")) {
                                minWidth = (containerWidth / 100) * parseFloat(column.minWidth)
                              } else {
                                minWidth = `${column.minWidth}px`
                              }
                            }

                            if (column.maxWidth) {
                              if (typeof column.maxWidth === "string" && column.maxWidth.endsWith("%")) {
                                maxWidth = (containerWidth / 100) * parseFloat(column.maxWidth)
                              } else {
                                maxWidth = `${column.maxWidth}px`
                              }
                            }

                            if (column.preventContentCollapse) {
                              classNames.push("override-ka-prevent-content-collapse")
                            }

                            if (column.dataType === DataType.Icon) {
                              classNames.push("ka-cell-icon")
                            }

                            if (
                              p.mode === "edit" &&
                              p.editingMode === EditingMode.Cell &&
                              (column.isEditable || column.isEditable === undefined)
                            ) {
                              classNames.push("ka-cell-editable")
                            }

                            return {
                              id: id,
                              className: classNames.join(" "),
                              tabIndex: p.mode === "edit" && column.isEditable ? -1 : undefined,

                              style: {
                                width: column.explodeWidth ? "100%" : "auto",
                                minWidth: minWidth,
                                maxWidth: maxWidth,
                              },
                            }
                          },
                        },
                      }}
                    />
                  </Align>

                  {p.mode === "edit" && p.editingMode !== EditingMode.Cell ? (
                    <Align center vertical>
                      <Divider fill={[Color.Neutral, 100]} />

                      <Spacer xsmall />

                      <InputButtonTertiary
                        width="auto"
                        size="small"
                        iconNameLeft="add"
                        label="Add row"
                        disabled={editRowId !== null}
                        onClick={() => {
                          table.insertRow(createNewRow(p.data), {
                            rowKeyValue: p.data[p.data.length - 1]?.key || 0,
                            insertRowPosition: InsertRowPosition.after,
                          })
                        }}
                      />

                      <Spacer xsmall />
                    </Align>
                  ) : (
                    <></>
                  )}
                </Stack>
              )}
            </div>
          </Align>
        </Stack>
      </div>

      <Alert
        open={deleteId !== null}
        title={
          <Text fill={[Color.Error, 700]} {...getTextSizeProps()}>
            Delete row?
          </Text>
        }
        description={
          <Text fill={[Color.Neutral, 700]} {...getTextSizeProps("xsmall")} wrap>
            Are you sure you want to delete this row?
          </Text>
        }
        buttonPrimary={
          <InputButtonPrimary
            size="small"
            width="auto"
            onClick={() => {
              table.dispatch(deleteRow(deleteId))
            }}
            label="Delete"
            destructive
          />
        }
        buttonSecondary={
          <InputButtonTertiary size="small" width="auto" onClick={() => setDeleteId(null)} label="Cancel" />
        }
      />
    </>
  )
}
