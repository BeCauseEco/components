import { Color, ColorWithLightness, adjustLightness, computeColor } from "@new/Color"

const getCellPadding = (size?: "none" | "tiny" | "xsmall" | "small" | "medium") => {
  switch (size) {
    case "none":
      return "0"
    case "tiny":
      return "0 calc(var(--BU) * 1)"
    case "xsmall":
      return "0 calc(var(--BU) * 2)"
    case "small":
      return "0 calc(var(--BU) * 3)"
    case "medium":
    default:
      return "0 calc(var(--BU) * 4)"
  }
}

const getFirstLastCellPadding = (size?: "none" | "tiny" | "xsmall" | "small" | "medium") => {
  switch (size) {
    case "none":
      return "0"
    case "tiny":
      return "calc(var(--BU) * 1)" // Use full tiny padding instead of half
    case "xsmall":
      return "calc(var(--BU) * 1)"
    case "small":
      return "calc(var(--BU) * 1.5)"
    case "medium":
    default:
      return "calc(var(--BU) * 2)"
  }
}

export const createDataTableStyles = (
  cssScope: string,
  fill?: ColorWithLightness,
  stroke?: ColorWithLightness,
  cellPaddingSize?: "none" | "tiny" | "xsmall" | "small" | "medium",
  noColumnLines?: boolean,
  borderless?: boolean,
) => `
  .${cssScope} .ka {
    background-color: unset;
    font-size: unset;
    width: 100%;
  }

  .${cssScope} .ka .ka-table-wrapper::-webkit-scrollbar-track {
    background: ${computeColor(fill || [Color.White])} !important;
  }

  .${cssScope} .ka .ka-table-wrapper::-webkit-scrollbar-thumb {
    border: 5px solid ${computeColor(fill || [Color.White])} !important;
  }

  .${cssScope} .ka .ka-table-wrapper:hover::-webkit-scrollbar-thumb {
    border: 4px solid ${computeColor(fill || [Color.White])} !important;
  }

  .${cssScope} .ka .ka-table-wrapper::-webkit-scrollbar-corner {
    background: ${computeColor(fill || [Color.White])} !important;
  }

  .${cssScope} .ka-table {
    table-layout: unset;
  }

  .${cssScope} .ka .ka-table-wrapper {
    background-color: unset;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    margin: 1px;
  }

  .${cssScope} .ka colgroup {
    display: none;
    visibility: hidden;
  }

  .${cssScope} .ka-thead {
    display: "table-header-group";
    position: relative;
  }

  .${cssScope} .ka-thead-background {
    background-color: ${computeColor(fill || [Color.White])};
  }

  .${cssScope} .ka-thead-cell-height {
    height: calc(var(--BU) * 10);
  }

  .${cssScope} .ka-thead-cell {
    padding: ${getCellPadding(cellPaddingSize)};
    color: unset;
    z-index: 3;
  }

  .${cssScope} .ka-thead-row  {
    border-bottom: solid 1px transparent;
  }

  .${cssScope} .ka-thead-row .ka-thead-cell:first-child {
    padding-left: ${borderless ? "0" : getFirstLastCellPadding(cellPaddingSize)};
  }

  .${cssScope} .ka-thead-row .ka-thead-cell:last-child {
    padding-right: ${getFirstLastCellPadding(cellPaddingSize)};
  }

  .${cssScope} .ka-cell {
    padding: ${getCellPadding(cellPaddingSize)};
    height: calc(var(--BU) * 10);
    line-height: unset;
    color: unset;
  }

  .${cssScope} .ka-cell-text {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  
  .${cssScope} .ka-cell:hover {
    background-color: unset;
  }

  .${cssScope} .ka-cell.override-ka-fixed-right {
    padding-left: ${getFirstLastCellPadding(cellPaddingSize)};
  }

  .${cssScope} .ka-cell:first-child {
    padding-left: ${borderless ? "0" : getFirstLastCellPadding(cellPaddingSize)};
    z-index: 3;
  }

  .${cssScope} .ka-cell:first-child.ka-cell-icon {
    padding: 0;
  }

  .${cssScope} .ka-cell:last-child {
    padding-right: ${getFirstLastCellPadding(cellPaddingSize)};
    z-index: 3;
  }

  .${cssScope} .ka-cell:not(:last-child) {
    border-right: ${noColumnLines ? "none" : `dotted 1px ${computeColor(stroke || [Color.Neutral, 100])}`};
  }

  .${cssScope}[data-mode="edit"] .ka-cell.ka-cell-editable:hover {
    background-color: ${computeColor([Color.Neutral, 100])};
    cursor: pointer;
  }
  
  .${cssScope} .ka-cell-editor {
    min-width: 0;
    max-width: 100%;
  }

  .${cssScope} .ka-row {
    border-bottom: solid 1px ${computeColor(stroke || [Color.Neutral, 100])};
    border-top: solid 1px ${computeColor(stroke || [Color.Neutral, 100])};
  }

  .${cssScope} .ka-row:last-child {
    border-bottom: none;
  }

  .${cssScope} .ka-even {
    background-color: unset;
  }

  .${cssScope} .ka-row:hover,
  .${cssScope} .ka-row:hover .override-ka-fixed-left,
  .${cssScope} .ka-row:hover .override-ka-fixed-right {
    background-color: ${computeColor(fill ? adjustLightness(fill, 1) : [Color.Neutral, 50])};
  }

  .${cssScope} .ka-row:hover .override-ka-fixed-left:after,
  .${cssScope} .ka-row:hover .override-ka-fixed-right:after {
    background: transparent;
  }

  .${cssScope} .ka-row-selected {
    background-color: unset;
  }

  .${cssScope} .override-ka-fixed-left,
  .${cssScope} .override-ka-fixed-right {
    position: sticky;
    background-color: ${computeColor(fill || [Color.White])};
    z-index: 4;
  }

  .${cssScope} .override-ka-fixed-left {
    left: 0;
  }

  .${cssScope} .override-ka-fixed-right {
    right: 0;
  }

  .${cssScope} .override-ka-fixed-left:after,
  .${cssScope} .override-ka-fixed-right:after {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    width: 8px;
  }

  .${cssScope} .ka-thead-row .ka-thead-cell:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: ${computeColor(stroke || [Color.Neutral, 100])};
  }

  .${cssScope} .ka-thead-row .override-ka-fixed-left:after {
    width: 20px;
    right: -20px;
    border: none;
    background: linear-gradient(to right, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .ka-thead-row .override-ka-fixed-right:after {
    width: 20px;
    left: -20px;
    border: none;
    background: linear-gradient(to left, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .override-ka-fixed-left:after {
    right: -8px;
    border-left: ${noColumnLines ? "none" : `solid 1px ${computeColor(stroke || [Color.Neutral, 100])}`};
    background: linear-gradient(to right, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .override-ka-fixed-right:after {
    left: -8px;
    border-right: ${noColumnLines ? "none" : `solid 1px ${computeColor(stroke || [Color.Neutral, 100])}`};
    background: linear-gradient(to left, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .ka-no-data-row {
    height: unset;
  }

  .${cssScope} .ka-no-data-cell {
    font-style: italic;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    height: calc(var(--BU) * 16);
    border-bottom: dotted 1px ${computeColor(stroke || [Color.Neutral, 100])};
  }

  .${cssScope} .ka-thead-cell-resize {
    left: unset;
  }

  .${cssScope} #reference-target {
    display: flex;
    flexDirection: column;
    position: relative;
    width: inherit;
    height: inherit;
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
      background-color: unset !important;
    }
  }
`
