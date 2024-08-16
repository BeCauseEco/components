import { EDirection } from "@new/EDirection"
import { TChartItem } from "../ChartItem"
import { ReactElement, SVGProps } from "react"

export type AxisConfiguration = {
  tick?: SVGProps<SVGTextElement> | ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | boolean
  tickFormatter?: (value: any, index: number) => string
  type?: "number" | "category"
  dataKey?: string
}

export type TChartBase = {
  data: any
  items: TChartItem[]
  direction?: EDirection
  xAxis?: AxisConfiguration
  yAxis?: AxisConfiguration
  height?: number
}
