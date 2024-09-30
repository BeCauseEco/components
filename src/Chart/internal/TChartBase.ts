import { EDirection } from "@new/EDirection"
import { TChartItem } from "../ChartItem"
import { ReactNode, SVGProps } from "react"

export type AxisConfiguration = {
  tick?: SVGProps<SVGTextElement> | ReactNode<SVGElement> | ((props: any) => ReactNode<SVGElement>) | boolean
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
