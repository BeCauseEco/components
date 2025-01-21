import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import { InsertRowPosition, SortDirection, ITableProps, SortingMode, Table, useTable, useTableInstance } from "ka-table"
import { ICellEditorProps, ICellTextProps } from "ka-table/props"
import { closeRowEditors, deleteRow, openRowEditors, saveRowEditors } from "ka-table/actionCreators"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { Spacer } from "@new/Stack/Spacer"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { css, Global } from "@emotion/react"
import { InputTextSingle, InputTextSingleProps } from "@new/InputText/InputTextSingle"
import { Color, computeColor } from "@new/Color"
import { InputTextDate, InputTextDateProps } from "@new/InputText/InputTextDate"
import { InputCheckbox, InputCheckboxProps } from "@new/InputCheckbox/InputCheckbox"
import { StyleBodySmall, StyleFontFamily, Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import styled from "@emotion/styled"
import { Children, ReactElement, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Divider } from "@new/Divider/Divider"
import { kaPropsUtils } from "ka-table/utils"
import { Alert } from "@new/Alert/Alert"
import { InputComboboxProps } from "@new/InputCombobox/InputCombobox"
import { ProgressIndicator } from "@new/ProgressIndicator/ProgressIndicator"
import { ProgressIndicatorItem } from "@new/ProgressIndicator/ProgressIndicatorItem"

export { SortDirection } from "ka-table"

type ColumnInternal<T> = ITableProps<T>["columns"][number]

const KEY_DRAG = "DRAG"
const KEY_ACTIONS = "ACTIONS"

const createNewRow = <T extends DataModel>(data: T[]): object => {
  return { id: Math.max(...data.map(d => d.id)) + 1 } // should T have an id: number property?
}

const formatValue = (value: string, dataType: DataType): string => {
  switch (dataType) {
    case DataType.Number:
      return value
        ? new Intl.NumberFormat(undefined, {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(value))
        : "–"

    case DataType.Date:
      return value ? new Date(value).toLocaleDateString() : "–"

    case DataType.Boolean:
      return value ? (value === "true" ? "Yes" : "No") : "–"

    case DataType.String:
      return value || "–"

    default:
      return "–"
  }
}

const csv = <T extends DataModel>(data: T[], columns: Column<T>[]) => {
  // const dataSanitized: T[] = [columns.map(c => c.title)] // what?
  const dataSanitized: string[][] = [columns.map(c => c.title)] // like this?

  data.forEach(row => {
    const rowSanitized: string[] = []

    columns.forEach(column => {
      // const value = (row[column.key] || "").toString() // column.key can be "DRAG" or "ACTIONS" which are invalid here
      const value = (row[column.key as keyof T] || "").toString() // not correct, should be narrowed instead probably...

      if (column.dataType === DataType.Boolean) {
        rowSanitized.push(value !== undefined ? (value ? "Yes" : "No") : "")
      } else if (column.dataType === DataType.String) {
        rowSanitized.push(value.lastIndexOf(";") !== -1 ? `"${value}"` : value)
      } else if (column.dataType === DataType.ProgressIndicator) {
        // rowSanitized.push(row[column.key]?.["value"] || "")
        rowSanitized.push(row[column.key as keyof T]?.["value"] || "") // not correct, should be narrowed instead probably...
      } else {
        rowSanitized.push(value)
      }
    })

    // dataSanitized.push(rowSanitized)
    dataSanitized.push(rowSanitized)
  })

  if (window) {
    window.open("data:text/csv;charset=utf-8," + dataSanitized.map(ds => ds.join(";")).join("\n"))
  }
}

const ActionEdit = ({ dispatch, rowKeyValue, disabled }: ICellTextProps & { disabled: boolean }) => {
  return (
    <InputButtonIconTertiary
      size="small"
      iconName="edit"
      onClick={() => dispatch(openRowEditors(rowKeyValue))}
      disabled={disabled}
    />
  )
}

const ActionSaveCancel = ({ dispatch, rowKeyValue }: ICellEditorProps) => {
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

const CellInputTextSingle = ({ column, rowKeyValue, value }: ICellEditorProps) => {
  const table = useTableInstance()

  return (
    <InputTextSingle
      value={value}
      width="auto"
      size="small"
      color={Color.Neutral}
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
    />
  )
}

const CellInputTextDate = ({ column, rowKeyValue, value }: ICellEditorProps) => {
  const table = useTableInstance()

  return (
    <InputTextDate
      value={value ? new Date(value).toISOString().slice(0, 10) : ""}
      width="auto"
      size="small"
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
      color={Color.Neutral}
    />
  )
}

const CellInputCheckbox = ({ column, rowKeyValue, value }: ICellEditorProps) => {
  const table = useTableInstance()

  return (
    <InputCheckbox
      value={value || false}
      size="small"
      onChange={v => {
        table.updateCellValue(rowKeyValue, column.key, v)
      }}
      color={Color.Neutral}
    />
  )
}

const CellProgressIndicator = (cellTextProps: ICellTextProps | ICellEditorProps) => {
  const progressIndicator = cellTextProps.column["progressIndicator"] as Column<unknown>["progressIndicator"]
  const type = progressIndicator?.type || "bar"
  const { value, color } = progressIndicator?.calculate(cellTextProps.rowData) || { value: 0, color: Color.Neutral }

  return (
    <Stack hug horizontal>
      <Align horizontal left={type === "bar"} center={type === "circle"}>
        <ProgressIndicator type={type} size="large" color={Color.Neutral}>
          <ProgressIndicatorItem width={`${value}%`} color={color} />
        </ProgressIndicator>
      </Align>
    </Stack>
  )
}

const CellHeadLink = styled.a({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
})

const Export = styled.div({
  all: "inherit",

  "& a": {
    all: "unset",
    cursor: "pointer",
  },
})

export enum DataType {
  Internal = "internal",
  Boolean = "boolean",
  Date = "date",
  Number = "number",
  Object = "object",
  String = "string",
  ProgressIndicator = "progressindicator",
}

export type Column<T> = {
  key: Extract<keyof T, string>
  title: string
  dataType: DataType
  width?: `${number}${"px" | "%"}`
  minWidth?: `calc(var(--BU) * ${number})`

  progressIndicator?: {
    type: "bar" | "circle"

    calculate: (rowData: ICellTextProps["rowData"]) => {
      value: number
      color: Color
    }
  }
}

type Children =
  | ReactElement<InputCheckboxProps>
  | ReactElement<InputComboboxProps>
  | ReactElement<InputTextSingleProps>
  | ReactElement<InputTextDateProps>

type DataModel = {
  id: number
  key: string
}

type PropertyKeysOfType<T, P> = { [K in keyof T]: T[K] extends P ? K : never }[keyof T]

export type DataTableProps<T extends DataModel> = {
  mode: "simple" | "filter" | "edit"
  data: T[]
  columns: Column<T>[]
  defaultSortColumn: Extract<keyof T, string>
  rowKeyField: Extract<keyof T, string>
  exportName: string
  fixedKeyField?: Extract<keyof T, string>
  selectKeyField?: PropertyKeysOfType<T, boolean>
  virtualScrolling?: boolean
  loading?: boolean
  onChange?: (value: T[]) => void
  onChangeRow?: (value: T) => void
  children?: Children | Children[]
}

export const DataTable = <T extends DataModel>(p: DataTableProps<T>) => {
  const [filter, setFilter] = useState("")
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedFields, setSelectedFields] = useState<number>(
    p.data.filter(d => p.selectKeyField && d[p.selectKeyField]).length,
  )
  const [dataTemp, setDataTemp] = useState<T[]>([])

  let nativeColumns: ColumnInternal<T>[] = []

  nativeColumns = p.columns.map(column => {
    return {
      key: column.key,
      title: column.title,
      dataType: column.dataType as any,
      progressIndicator: column.progressIndicator,
      sortDirection: p.mode !== "edit" && column.key === p.defaultSortColumn ? SortDirection.Ascend : undefined,
      style: {
        width: column.width || "auto",
        "min-width": column.minWidth || "0px",
      },
    }
  })

  if (p.mode === "edit") {
    nativeColumns = [
      ...nativeColumns,
      {
        key: KEY_ACTIONS,
        title: "",
        dataType: DataType.Internal as any,
      },
    ]
  }

  const updateSelectField = (index: number, value: boolean) => {
    if (p.selectKeyField === undefined) {
      return
    }

    const d = [...p.data]

    // @ts-expect-error: This is ensured to be a boolean property due to typing
    d[index][p.selectKeyField] = value // can selectKeyField only point to boolean properties?

    if (p.onChange) {
      p.onChange(d)
    }

    if (p.onChangeRow) {
      p.onChangeRow(d[index])
    }

    setSelectedFields(d.filter(d => p.selectKeyField && d[p.selectKeyField]).length)
  }

  const updateSelectFieldAll = (value: boolean) => {
    if (p.selectKeyField === undefined) {
      return
    }

    const d = [...p.data]

    d.forEach(row => {
      if (p.selectKeyField) {
        // @ts-expect-error: This is ensured to be a boolean property due to typing
        row[p.selectKeyField] = value
      }
    })

    if (p.onChange) {
      p.onChange(d)
    }

    setSelectedFields(d.filter(d => p.selectKeyField && d[p.selectKeyField]).length)
  }

  const table = useTable({
    onDispatch: d => {
      const rowKeyValue = d.rowKeyValue

      if (d.type === "OpenRowEditors") {
        setEditId(d.rowKeyValue)
        setDataTemp(p.data)
      }

      if (d.type === "ReorderRows") {
        setDataTemp(kaPropsUtils.getData(table.props))
      }

      if (d.type === "CloseRowEditors") {
        setEditId(null)

        if (p.onChange) {
          p.onChange(dataTemp)
        }

        table.updateData(dataTemp)
      }

      if (d.type === "SaveRowEditors" || d.type === "ReorderRows" || d.type === "InsertRow" || d.type === "DeleteRow") {
        const data = kaPropsUtils.getData(table.props)

        if (d.type !== "ReorderRows") {
          setEditId(null)
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

  const printReference = useRef<HTMLDivElement>(null)
  const print = useReactToPrint({ contentRef: printReference, documentTitle: p.exportName })

  return (
    <>
      <Global
        styles={css`
          .ka {
            background-color: white;
            font-size: unset;
            width: 100%;
          }

          .ka-table {
            table-layout: unset;
          }

          .ka colgroup {
            display: none;
            visibility: hidden;
          }

          .ka-thead-background {
            background-color: ${computeColor([Color.White])};
          }

          .ka-thead-cell-height {
            height: calc(var(--BU) * 10);
          }

          .ka-thead-cell {
            padding: 0 calc(var(--BU) * 4);
            color: unset;
          }

          .ka-thead-row .ka-thead-cell:first-child {
            padding-left: calc(var(--BU) * 2);
          }

          .ka-thead-row .ka-thead-cell:last-child {
            padding-left: calc(var(--BU) * 2);
          }

          .ka-cell {
            padding: var(--BU) calc(var(--BU) * 4);
            height: calc(var(--BU) * 10);
            line-height: unset;
            color: unset;
          }

          .ka-cell:first-child {
            padding-left: calc(var(--BU) * 2);
          }

          .ka-cell:last-child {
            padding-right: calc(var(--BU) * 2);
          }

          .ka-cell:not(:last-child) {
            border-right: dotted 1px ${computeColor([Color.Neutral, 100])};
          }

          .ka-cell:hover {
            background-color: unset;
          }

          .ka-row {
            border-bottom: solid 1px ${computeColor([Color.Neutral, 100])};
            border-top: solid 1px ${computeColor([Color.Neutral, 100])};
          }

          .ka-row:last-child {
            border-bottom: none;
          }

          .ka-even {
            background-color: unset;
          }

          .ka-row:hover {
            background-color: ${computeColor([Color.Neutral, 50])};
          }

          .ka-row-selected {
            background-color: unset;
          }

          .override-ka-fixed-left,
          .override-ka-fixed-right {
            position: sticky;
            background-color: ${computeColor([Color.White])};
            z-index: 999999999;
          }

          .override-ka-fixed-left {
            left: 0;
          }

          .override-ka-fixed-right {
            right: 0;
          }

          .override-ka-fixed-left:after,
          .override-ka-fixed-right:after {
            content: "";
            position: absolute;
            top: 0;
            height: 100%;
            width: 8px;
          }

          .override-ka-virtual .ka-thead-row {
            border-bottom: solid 1px white;
          }

          .override-ka-virtual .ka-thead-row .ka-thead-cell:before {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 8px;
            width: 100%;
            border-top: solid 1px ${computeColor([Color.Neutral, 100])};
            background: linear-gradient(to bottom, ${computeColor([Color.Neutral, 50])}, transparent);
          }

          .override-ka-reorder .ka-row {
            cursor: move;
          }

          .ka-thead-row .override-ka-fixed-left:after {
            width: 20px;
            right: -20px;
            border: none;
            background: linear-gradient(to right, ${computeColor([Color.White])}, transparent);
          }

          .override-ka-fixed-left:after {
            right: -8px;
            border-left: solid 1px ${computeColor([Color.Neutral, 100])};
            background: linear-gradient(to right, ${computeColor([Color.Neutral, 50])}, transparent);
          }

          .override-ka-fixed-right:after {
            left: -8px;
            border-right: solid 1px ${computeColor([Color.Neutral, 100])};
            background: linear-gradient(to left, ${computeColor([Color.Neutral, 50])}, transparent);
          }

          .ka-row:hover .override-ka-fixed-left,
          .ka-row:hover .override-ka-fixed-right {
            background-color: ${computeColor([Color.Neutral, 50])};
          }

          .override-ka-editing-row,
          .override-ka-editing-row:hover,
          .override-ka-editing-row .override-ka-fixed-left,
          .override-ka-editing-row:hover .override-ka-fixed-left,
          .override-ka-editing-row .override-ka-fixed-right,
          .override-ka-editing-row:hover .override-ka-fixed-right {
            background-color: ${computeColor([Color.Quarternary, 50])};
          }

          .override-ka-editing-row .override-ka-fixed-left:after {
            background: linear-gradient(to right, ${computeColor([Color.Quarternary, 50])}, transparent);
          }

          .override-ka-editing-row .override-ka-fixed-right:after {
            background: linear-gradient(to left, ${computeColor([Color.Quarternary, 50])}, transparent);
          }

          .override-ka-editing-row {
            outline: solid 1px ${computeColor([Color.Quarternary, 100])};
            outline-offset: -1px;
          }

          .ka-no-data-row {
            height: unset;
          }

          .ka-no-data-cell {
            ${StyleFontFamily}
            ${StyleBodySmall}
            padding: var(--BU) calc(var(--BU) * 2);
            height: calc(var(--BU) * 10);
          }

          .ka-thead-cell-resize {
            left: unset;
          }

          .ka-drag-over-row,
          .ka-drag-over-row th,
          .ka-drag-over-row td {
            box-shadow: inset 0 1px 0 0 ${computeColor([Color.Quarternary, 700])};
          }

          .ka-dragged-row ~ .ka-drag-over-row {
            box-shadow: unset;
          }

          @media print {
            .ka {
              zoom: 0.5 !important;
              width: calc(100% - 8em) !important;
              margin: 4em !important;
            }

            .ka * {
              overflow: visible !important;
              position: static !important;
            }

            .ka p {
              white-space: normal !important;
            }

            .ka td,
            .ka th {
              width: auto !important;
              min-width: auto !important;
            }
          }
        `}
      />

      <Stack vertical hug stroke={[Color.Neutral, 100]} cornerRadius="large" loading={p.loading} overflowHidden>
        <Align left horizontal>
          <Stack hug="partly" horizontal>
            <Align left horizontal>
              {p.mode === "filter" ? (
                <InputTextSingle
                  iconNameLeft="search"
                  value={filter}
                  width="fixed"
                  size="small"
                  placeholder="Search"
                  onChange={v => setFilter(v)}
                  color={Color.Neutral}
                />
              ) : (
                <></>
              )}

              {Children.toArray(p.children).map(child => (
                <>
                  <Spacer medium />

                  {child}
                </>
              ))}

              <Spacer large />

              <Align right horizontal>
                <Export>
                  <InputButtonIconTertiary size="small" iconName="csv" onClick={() => csv(p.data, p.columns)} />
                  <InputButtonIconTertiary size="small" iconName="print" onClick={() => print()} />
                </Export>
              </Align>
            </Align>
          </Stack>
        </Align>

        {p.mode === "filter" ? <Spacer small /> : <></>}

        <Align left vertical>
          <div
            style={{ display: "flex", flexDirection: "column", width: "inherit", height: "inherit" }}
            ref={printReference}
          >
            <Table
              table={table}
              columns={nativeColumns as any}
              data={p.data}
              rowKeyField={p.rowKeyField} // Table.rowKeyField doesn't support number | symbol which is a bit weird.. but okay.. we can restrict the properties to only allow string names
              sortingMode={SortingMode.Single}
              rowReordering={p.mode === "edit"}
              noData={{ text: "Nothing found" }}
              searchText={filter}
              virtualScrolling={p.mode !== "edit" && p.virtualScrolling ? { enabled: true } : { enabled: false }}
              search={({ searchText: searchTextValue, rowData, column }) => {
                if (column.dataType === DataType.Boolean) {
                  const b = rowData[column.key]
                  const s = searchTextValue.toLowerCase()

                  return (s === "yes" && b === true) || (s === "no" && b === false)
                }
              }}
              childComponents={{
                tableWrapper: {
                  elementAttributes: () => {
                    if (p.mode !== "edit" && p.virtualScrolling) {
                      return {
                        className: "override-ka-virtual",
                        style: {
                          height: "calc(100% - var(--BU) * 14)",
                        },
                      }
                    }

                    if (p.mode === "edit") {
                      return {
                        className: "override-ka-reorder",
                      }
                    }
                  },
                },

                dataRow: {
                  elementAttributes: dataRowElementAttributes => {
                    if (dataRowElementAttributes.rowKeyValue === editId) {
                      return {
                        className: "override-ka-editing-row",
                      }
                    }
                  },
                },

                headCell: {
                  content: headCellContent => {
                    if (headCellContent.column.key === KEY_DRAG || headCellContent.column.key === KEY_ACTIONS) {
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

                    const headCellContentAsColumn = headCellContent.column as Column<unknown>

                    return (
                      <Stack hug horizontal>
                        {(p.mode === "simple" || p.mode === "filter") && p.selectKeyField && firstColumn ? (
                          <>
                            <Align left horizontal hug>
                              <InputCheckbox
                                size="small"
                                color={Color.Neutral}
                                value={
                                  selectedFields === p.data.length
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
                          {p.mode === "edit" || headCellContentAsColumn.dataType === DataType.ProgressIndicator ? (
                            <Text fill={[Color.Neutral, 700]} xsmall>
                              <b>{headCellContent.column.title}</b>
                            </Text>
                          ) : (
                            <CellHeadLink onClick={() => table.updateSortDirection(headCellContent.column.key)}>
                              <Text fill={[Color.Neutral, 700]} xsmall>
                                <b>{headCellContent.column.title}</b>
                              </Text>

                              <Spacer tiny />

                              <Icon medium name={iconName} fill={[Color.Neutral, 700]} />
                            </CellHeadLink>
                          )}
                        </Align>
                      </Stack>
                    )
                  },

                  elementAttributes: headCellElementAttributes => {
                    if (p.fixedKeyField === headCellElementAttributes.column.key) {
                      return {
                        className: "override-ka-fixed-left",
                      }
                    }
                  },
                },

                cellText: {
                  content: cellTextContent => {
                    if (cellTextContent.column.key === KEY_ACTIONS) {
                      return (
                        <Stack horizontal hug>
                          <Align horizontal right>
                            <InputButtonIconTertiary
                              size="small"
                              iconName="delete"
                              onClick={() => setDeleteId(cellTextContent.rowKeyValue)}
                              disabled={editId !== null}
                              destructive
                            />

                            <ActionEdit {...cellTextContent} disabled={editId !== null} />
                          </Align>
                        </Stack>
                      )
                    } else {
                      const monospace =
                        cellTextContent.column.dataType === DataType.Date ||
                        cellTextContent.column.dataType === DataType.Number ||
                        cellTextContent.column.dataType === DataType.Boolean

                      const alignmentRight = cellTextContent.column.dataType === DataType.Number
                      const firstColumn = cellTextContent.column.key === nativeColumns[0].key

                      let output = <></>

                      if ((cellTextContent.column as Column<unknown>).dataType === DataType.ProgressIndicator) {
                        output = <CellProgressIndicator {...cellTextContent} />
                      } else {
                        output = (
                          <Text fill={[Color.Neutral, 700]} small monospace={monospace}>
                            {formatValue(
                              cellTextContent.value?.toString(),
                              cellTextContent.column.dataType || DataType.String,
                            )}
                          </Text>
                        )
                      }

                      return (
                        <Stack hug horizontal>
                          {p.mode === "edit" && firstColumn ? (
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
                                  value={!!p.data[cellTextContent.rowKeyValue]?.[p.selectKeyField]}
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
                            {output}
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
                        {p.mode === "edit" && firstColumn ? (
                          <Align left horizontal hug>
                            <Icon name="drag_indicator" medium fill={[Color.Neutral, 700]} />

                            <Spacer xsmall />
                          </Align>
                        ) : (
                          <></>
                        )}

                        {(cellEditorContent.column as Column<unknown>).dataType === DataType.ProgressIndicator ? (
                          <Align left horizontal>
                            <CellProgressIndicator {...cellEditorContent} />
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
                            <CellInputTextSingle {...cellEditorContent} />
                          </Align>
                        ) : (
                          <></>
                        )}

                        {cellEditorContent.column.key === KEY_ACTIONS ? (
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
                    if (p.fixedKeyField === cellElementAttributes.column.key) {
                      return {
                        className: "override-ka-fixed-left",
                      }
                    }

                    if (p.fixedKeyField && cellElementAttributes.column.key === KEY_ACTIONS) {
                      return {
                        className: "override-ka-fixed-right",
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </Align>

        {p.mode === "edit" ? (
          <>
            <Divider horizontal fill={[Color.Neutral, 100]} />

            <Align left horizontal>
              <Stack hug="partly" horizontal fill={[Color.White]} cornerRadius="medium">
                <Align center horizontal>
                  <InputButtonTertiary
                    width="auto"
                    size="small"
                    iconNameLeft="add"
                    label="Add row"
                    disabled={editId !== null}
                    onClick={() => {
                      table.insertRow(createNewRow(p.data), {
                        rowKeyValue: p.data[p.data.length - 1]?.key || 0, // key? who says that's a thing?
                        insertRowPosition: InsertRowPosition.after,
                      })
                    }}
                  />
                </Align>
              </Stack>
            </Align>
          </>
        ) : (
          <></>
        )}
      </Stack>

      <Alert
        open={deleteId !== null}
        title={
          <Text fill={[Color.Error, 700]} small>
            Delete row?
          </Text>
        }
        description={
          <Text fill={[Color.Neutral, 700]} xsmall wrap>
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
