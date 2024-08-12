import { ComponentType, PropsWithChildren, ReactElement } from "react"
import styled from "@emotion/styled"

import dynamic from "next/dynamic"
import { TChartBase } from "./TChartBase"
import { TChartBar } from "./_ChartBar"
import { TChartLine } from "./_ChartLine"
import { TChartItem } from "./ChartItem"
import React from "react"

const Container = styled.div({
  display: "flex",
})

export enum EChartType {
  Bar,
  Line,
}

export type TChart = Omit<TChartBase, "items"> & {
  type: EChartType
  children: ReactElement<TChartItem> | ReactElement<TChartItem>[]
}

export const Chart = ({ type, direction, xAxis, yAxis, data, height, children }: PropsWithChildren<TChart>) => {
  let Chart: ComponentType<TChartBar> | ComponentType<TChartLine> | null = null

  const items: TChartItem[] = []

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      items.push(child.props)
    }
  })

  if (type === EChartType.Bar) {
    Chart = dynamic(() => import("./_ChartBar"), {
      ssr: false,
    })
  }

  if (type === EChartType.Line) {
    Chart = dynamic(() => import("./_ChartLine"), {
      ssr: false,
    })
  }

  return (
    <Container>
      {Chart && <Chart direction={direction} xAxis={xAxis} yAxis={yAxis} data={data} items={items} height={height} />}
    </Container>
  )
}
