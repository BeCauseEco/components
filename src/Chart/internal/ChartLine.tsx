import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TChartBase } from "./TChartBase"
import { computeColor } from "@new/Color"

export type TChartLine = TChartBase & {}

export default ({ data, items, xAxis, yAxis }: TChartLine) => (
  <ResponsiveContainer width="100%" aspect={3}>
    <LineChart data={data}>
      {items.map((item, index) => (
        <Line type="monotone" key={index} dataKey={item.dataKey} stroke={computeColor(item.color)} />
      ))}

      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

      {xAxis && xAxis.type && xAxis.dataKey && <XAxis type={xAxis.type} dataKey={xAxis.dataKey} />}
      {xAxis && xAxis.type && !xAxis.dataKey && <XAxis type={xAxis.type} />}
      {xAxis && !xAxis.type && xAxis.dataKey && <XAxis dataKey={xAxis.dataKey} />}

      {yAxis && yAxis.type && yAxis.dataKey && <YAxis type={yAxis.type} dataKey={yAxis.dataKey} />}
      {yAxis && yAxis.type && !yAxis.dataKey && <YAxis type={yAxis.type} />}
      {yAxis && !yAxis.type && yAxis.dataKey && <YAxis dataKey={yAxis.dataKey} />}

      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
)
