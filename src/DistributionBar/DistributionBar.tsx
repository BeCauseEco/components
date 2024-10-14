import styled from "@emotion/styled"
import { EColor } from "@new/Color"
import * as Tooltip from "@radix-ui/react-tooltip"
import React from "react"
import { LayoutDistributionBar } from "./internal/LayoutDistributionBar"

const Segment = styled.div<{ color: EColor; width: number }>(props => ({
  height: "100%",
  width: `${props.width}%`,
  backgroundColor: props.color,
}))

const FillerSegment = styled.div<{ width: number }>(props => ({
  height: "100%",
  width: `${props.width}%`,
  backgroundColor: "#f0f0f0",
}))

const SegmentLabelContainer = styled.div({
  padding: "4px 8px",
  borderRadius: "4px",
  backgroundColor: "#333",
  color: "#fff",
  fontSize: "12px",
})

const SegmentLabel = ({ label }: { label: string }) => <SegmentLabelContainer>{label}</SegmentLabelContainer>

interface SegmentProps {
  label: string
  value: number
  color: EColor
}

interface DistributionBarProps {
  segments: SegmentProps[]
}

export const DistributionBar = ({ segments }: DistributionBarProps) => {
  const totalValue = segments.reduce((acc, segment) => acc + segment.value, 0)

  return (
    <Tooltip.Provider>
      <LayoutDistributionBar>
        {segments.map((segment, index) => (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger asChild>
              <Segment color={segment.color} width={segment.value} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="top" align="center" sideOffset={5} style={{ zIndex: 1 }}>
                <SegmentLabel label={segment.label} />
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
        {totalValue < 100 && <FillerSegment width={100 - totalValue} />}
      </LayoutDistributionBar>
    </Tooltip.Provider>
  )
}
