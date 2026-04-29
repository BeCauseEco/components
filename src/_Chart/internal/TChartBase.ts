import { EDirection } from "@new/EDirection"
import { TChartItem } from "../ChartItem"
import { ReactElement, ReactNode, SVGProps } from "react"

export type AxisConfiguration = {
  tick?:
    | Omit<SVGProps<SVGTextElement>, "children">
    | ReactElement<SVGElement>
    | ((props: any) => ReactNode)
    | boolean
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
