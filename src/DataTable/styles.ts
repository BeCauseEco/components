import { Color, ColorWithLightness, adjustLightness, computeColor } from "@new/Color"
import { StyleBodySmall, StyleFontFamily } from "@new/Text/Text"

export const createDataTableStyles = (cssScope: string, fill?: ColorWithLightness, stroke?: ColorWithLightness) => `
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
    padding: 0 calc(var(--BU) * 4);
    color: unset;
    z-index: 3;
  }

  .${cssScope} .ka-thead-row  {
    border-bottom: solid 1px transparent;
  }

  .${cssScope} .ka-thead-row .ka-thead-cell:first-child {
    padding-left: calc(var(--BU) * 2);
  }

  .${cssScope} .ka-thead-row .ka-thead-cell:last-child {
    padding-left: calc(var(--BU) * 2);
  }

  .${cssScope} .ka-cell {
    padding: 0 calc(var(--BU) * 4);
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

  .${cssScope} .override-ka-prevent-content-collapse .ka-cell-text,
  .${cssScope} .override-ka-prevent-content-collapse .ka-cell-text p {
    overflow: visible;
  }

  .${cssScope} .ka-cell.override-ka-fixed-right {
    padding-left: calc(var(--BU) * 2);
  }

  .${cssScope} .ka-cell:first-child {
    padding-left: calc(var(--BU) * 2);
    z-index: 3;
  }

  .${cssScope} .ka-cell:last-child {
    padding-right: calc(var(--BU) * 2);
    z-index: 3;
  }

  .${cssScope} .ka-cell:not(:last-child) {
    border-right: dotted 1px ${computeColor(stroke || [Color.Neutral, 100])};
  }

  .${cssScope}[data-mode="edit"] .ka-cell.ka-cell-editable:hover {
    background-color: ${computeColor([Color.Neutral, 100])};
    cursor: pointer;
  }
  
  .${cssScope} .ka-cell-editor {
    min-width: 160px !important;
    max-width: 200px;
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

  .${cssScope} .override-ka-virtual .ka-thead-row .ka-thead-cell:before {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 8px;
    width: 100%;
    border-top: solid 1px ${computeColor(stroke || [Color.Neutral, 100])};
    background: linear-gradient(to bottom, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .override-ka-reorder .ka-row {
    cursor: move;
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
    border-left: solid 1px ${computeColor(stroke || [Color.Neutral, 100])};
    background: linear-gradient(to right, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .override-ka-fixed-right:after {
    left: -8px;
    border-right: solid 1px ${computeColor(stroke || [Color.Neutral, 100])};
    background: linear-gradient(to left, ${computeColor(fill || [Color.White])}, transparent);
  }

  .${cssScope} .override-ka-editing-row,
  .${cssScope} .override-ka-editing-row:hover,
  .${cssScope} .override-ka-editing-row .override-ka-fixed-left,
  .${cssScope} .override-ka-editing-row:hover .override-ka-fixed-left,
  .${cssScope} .override-ka-editing-row .override-ka-fixed-right,
  .${cssScope} .override-ka-editing-row:hover .override-ka-fixed-right {
    background-color: ${computeColor([Color.Quarternary, 50])};
  }

  .${cssScope} .override-ka-editing-row .override-ka-fixed-left:after {
    background: linear-gradient(to right, ${computeColor([Color.Quarternary, 50])}, transparent);
  }

  .${cssScope} .override-ka-editing-row .override-ka-fixed-right:after {
    background: linear-gradient(to left, ${computeColor([Color.Quarternary, 50])}, transparent);
  }

  .${cssScope} .override-ka-editing-row {
    outline: solid 1px ${computeColor([Color.Quarternary, 100])};
    outline-offset: -1px;
  }

  .${cssScope} .ka-no-data-row {
    height: unset;
  }

  .${cssScope} .ka-no-data-cell {
    font-family: ${StyleFontFamily.fontFamily};
    font-style: ${StyleFontFamily.fontStyle};
    font-weight: ${StyleFontFamily.fontWeight};
    font-size: ${StyleBodySmall.fontSize};
    line-height: ${StyleBodySmall.lineHeight};
    height: calc(var(--BU) * 16);
    border-bottom: dotted 1px ${computeColor(stroke || [Color.Neutral, 100])};
  }

  .${cssScope} .ka-thead-cell-resize {
    left: unset;
  }

  .${cssScope} .ka-drag-over-row,
  .${cssScope} .ka-drag-over-row th,
  .${cssScope} .ka-drag-over-row td {
    box-shadow: inset 0 1px 0 0 ${computeColor([Color.Quarternary, 700])};
  }

  .${cssScope} .ka-dragged-row ~ .ka-drag-over-row {
    box-shadow: unset;
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
