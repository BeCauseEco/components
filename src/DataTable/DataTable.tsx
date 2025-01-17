import { Stack } from "@new/Stack/Stack"
import { Align } from "@new/Stack/Align"
import {
  DataType,
  InsertRowPosition,
  ITableInstance,
  SortDirection,
  SortingMode,
  Table,
  useTable,
  useTableInstance,
} from "ka-table"
import { ICellEditorProps, ICellTextProps } from "ka-table/props"
import { closeRowEditors, deleteRow, openRowEditors, saveRowEditors } from "ka-table/actionCreators"
import { InputButtonPrimary } from "@new/InputButton/InputButtonPrimary"
import { Spacer } from "@new/Stack/Spacer"
import { InputButtonTertiary } from "@new/InputButton/InputButtonTertiary"
import { css, Global } from "@emotion/react"
import { InputTextSingle } from "@new/InputText/InputTextSingle"
import { Color, computeColor } from "@new/Color"
import { InputTextDate } from "@new/InputText/InputTextDate"
import { InputCheckbox } from "@new/InputCheckbox/InputCheckbox"
import { StyleBodySmall, StyleFontFamily, Text } from "@new/Text/Text"
import { Icon } from "@new/Icon/Icon"
import styled from "@emotion/styled"
import { useRef, useState } from "react"
import "jspdf-autotable"
import jsPDF from "jspdf"
import { useReactToPrint } from "react-to-print"
import { getValueByColumn } from "ka-table/Utils/DataUtils"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"
import { Divider } from "@new/Divider/Divider"
import { kaPropsUtils } from "ka-table/utils"
import { Alert } from "@new/Alert/Alert"

export { DataType, SortDirection } from "ka-table"

const KEY_DRAG = "DRAG"
const KEY_ACTIONS = "ACTIONS"

const createNewRow = (data: DataTableProps["data"]): object => {
  return { id: Math.max(...data.map(d => d.id)) + 1 }
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

const csv = (data: DataTableProps["data"], columns: ColumnProps[]) => {
  const dataSanitized: DataTableProps["data"] = []

  data.forEach(row => {
    const rowSanitized: string[] = []

    columns.forEach(column => {
      const value = (row[column.key] || "").toString()

      if (column.dataType === DataType.Boolean) {
        rowSanitized.push(value !== undefined ? (value ? "Yes" : "No") : "")
      } else if (column.dataType === DataType.String) {
        rowSanitized.push(value.lastIndexOf(";") !== -1 ? `"${value}"` : value)
      } else {
        rowSanitized.push(value)
      }
    })

    dataSanitized.push(rowSanitized)
  })

  if (window) {
    window.open("data:text/csv;charset=utf-8," + dataSanitized.map(ds => ds.join(";")).join("\n"))
  }
}

const pdf = (table: ITableInstance, exportName: string) => {
  const document: any = new jsPDF("landscape")

  document.autoTable({
    headStyles: { fillColor: "white", textColor: "black" },
    alternateRowStyles: { fillColor: "white" },
    head: [table.props.columns.map(c => c.title)],
    body: table.props.data!.map(d => table.props.columns.map(c => getValueByColumn(d, c))),
  })

  document.save(`${exportName}.pdf`)
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

type NativeColumnProps = {
  key: string
  title?: string
  dataType?: DataType
  style?: {
    width?: string
    "min-width"?: string
  }
}

type ColumnPropsInternal = {
  key: string
}

export type ColumnProps = ColumnPropsInternal & {
  title: string
  dataType: DataType
  width?: `${number}${"px" | "%"}`
  minWidth?: `calc(var(--BU) * ${number})`
  sortDirection?: SortDirection
}

export type DataTableProps = {
  mode: "simple" | "filter" | "edit"
  data: any[]
  columns: Array<ColumnProps | ColumnPropsInternal>
  defaultSortColumn: string
  rowKeyField: string
  exportName: string
  fixedKeyField?: string
  selectKeyField?: string
  virtualScrolling?: boolean
  loading?: boolean
  onChange?: (value: DataTableProps["data"]) => void
  onChangeRow?: (value: object) => void
}

export const DataTable = (p: DataTableProps) => {
  const [filter, setFilter] = useState("")
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedFields, setSelectedFields] = useState<number>(
    p.data.filter(d => p.selectKeyField && d[p.selectKeyField]).length,
  )
  const [dataTemp, setDataTemp] = useState<DataTableProps["data"]>([])

  let nativeColumns: NativeColumnProps[] = []

  nativeColumns = p.columns.map(c => {
    const columnProps = c as ColumnProps

    return {
      key: columnProps.key,
      title: columnProps.title,
      dataType: columnProps.dataType,
      sortDirection: p.mode !== "edit" && columnProps.key === p.defaultSortColumn ? SortDirection.Ascend : undefined,
      style: {
        width: columnProps.width || "auto",
        "min-width": columnProps.minWidth || "0px",
      },
    }
  })

  if (p.mode === "edit") {
    nativeColumns = [...nativeColumns, { key: KEY_ACTIONS }]
  }

  const updateSelectField = (index: number, value: boolean) => {
    if (p.selectKeyField === undefined) {
      return
    }

    const d = [...p.data]

    d[index][p.selectKeyField] = value

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

      if (d.type === "CloseRowEditors") {
        setEditId(null)

        if (p.onChange) {
          p.onChange(dataTemp)
        }

        table.updateData(dataTemp)
      }

      if (d.type === "SaveRowEditors" || d.type === "ReorderRows" || d.type === "InsertRow" || d.type === "DeleteRow") {
        const data = kaPropsUtils.getData(table.props)

        setEditId(null)

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
          @media print {
            .ka {
              zoom: 0.5 !important;
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

            .ka .override-ka-fixed-right {
              display: none !important;
              visibility: hidden !important;
            }
          }

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

          .override-ka-virtual .ka-thead-row:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 8px;
            width: 100%;
            background: linear-gradient(to top, ${computeColor([Color.Neutral, 50])}, transparent);
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

          .override-ka-editing-row,
          .override-ka-editing-row ~ .override-ka-editing-row {
            outline: solid 1px ${computeColor([Color.Quarternary, 100])};
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

          .ka-drag-over-row {
            box-shadow: inset 0 4px 0px -2px ${computeColor([Color.Quarternary, 400])};
          }

          .ka-dragged-row ~ .ka-drag-over-row {
            box-shadow: inset 0 -4px 0px -2px ${computeColor([Color.Quarternary, 400])};
          }
        `}
      />

      <Stack vertical hug stroke={[Color.Neutral, 100]} cornerRadius="medium" loading={p.loading} overflowHidden>
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

              <Spacer small />

              <Align right horizontal>
                <Export>
                  <InputButtonIconTertiary
                    size="large"
                    iconName="csv"
                    onClick={() => csv(p.data, p.columns as ColumnProps[])}
                  />

                  <InputButtonIconTertiary size="large" iconName="docs" onClick={() => pdf(table, p.exportName)} />

                  <InputButtonIconTertiary size="large" iconName="print" onClick={() => print()} />
                </Export>
              </Align>
            </Align>
          </Stack>
        </Align>

        <Align left vertical>
          <div
            style={{ display: "flex", flexDirection: "column", width: "inherit", height: "inherit" }}
            ref={printReference}
          >
            <Table
              table={table}
              columns={nativeColumns}
              data={p.data}
              rowKeyField={p.rowKeyField}
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
                      return { className: "override-ka-virtual", style: { height: "calc(100% - var(--BU) * 14)" } }
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
                          {p.mode === "edit" ? (
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

                      return (
                        <Stack hug horizontal>
                          {p.mode === "edit" && firstColumn ? (
                            <Align left horizontal hug>
                              <div style={{ all: "inherit", cursor: "move" }}>
                                <Icon name="drag_indicator" medium fill={[Color.Neutral, 700]} />

                                <Spacer xsmall />
                              </div>
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
                                  value={p.data[cellTextContent.rowKeyValue]?.[p.selectKeyField] ?? false}
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
                            <Text fill={[Color.Neutral, 700]} small monospace={monospace}>
                              {formatValue(
                                cellTextContent.value?.toString(),
                                cellTextContent.column.dataType || DataType.String,
                              )}
                            </Text>
                          </Align>
                        </Stack>
                      )
                    }
                  },
                },

                cellEditor: {
                  content: cellEditorContent => {
                    switch (cellEditorContent.column.dataType) {
                      case DataType.Boolean:
                        return <CellInputCheckbox {...cellEditorContent} />
                      case DataType.Date:
                        return <CellInputTextDate {...cellEditorContent} />
                      case DataType.Number:
                        return <CellInputTextSingle {...cellEditorContent} />
                      case DataType.String:
                        return <CellInputTextSingle {...cellEditorContent} />
                    }

                    if (cellEditorContent.column.key === KEY_ACTIONS) {
                      return <ActionSaveCancel {...cellEditorContent} />
                    }
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
                        rowKeyValue: p.data[p.data.length - 1].key,
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
