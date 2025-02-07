import { XAxis, YAxis, Tooltip, Legend, Bar, BarChart, ResponsiveContainer } from "recharts"
import { TChartBase } from "./TChartBase"
import { computeColor } from "@new/Color"
import { EDirection } from "@new/EDirection"

export type TChartBar = TChartBase & {}

export default ({ data, items, direction, xAxis, yAxis, height }: TChartBar) => (
  <ResponsiveContainer height={height}>
    <BarChart data={data} layout={direction === EDirection.Horizontal ? "horizontal" : "vertical"}>
      {xAxis && (
        <XAxis type={xAxis.type} dataKey={xAxis.dataKey} tickFormatter={xAxis.tickFormatter} tick={xAxis.tick} />
      )}

      {yAxis && <YAxis type={yAxis.type} dataKey={yAxis.dataKey} tickFormatter={yAxis.tickFormatter} />}

      <Tooltip />

      {items.map((item, index) => (
        <Bar key={index} dataKey={item.dataKey} fill={computeColor(item.color)} />
      ))}

      <Legend verticalAlign="top" height={36} iconType="circle" iconSize={10} />
    </BarChart>
  </ResponsiveContainer>
)
