import styled from "@emotion/styled"
import { EColor } from "@new/Color"
import * as Tooltip from "@radix-ui/react-tooltip"
import React from "react"

const DistributionBarLayout = styled.div({
  display: "flex",
  width: "100%",
  height: "10px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #ddd",
})

const Segment = styled.div<{ color: EColor; width: number }>(props => ({
  height: "100%",
  width: `${props.width}%`,
  backgroundColor: props.color,
}))

const FillerSegment = styled.div({
  height: "100%",
  width: "100%",
  backgroundColor: "#f0f0f0",
})

const SegmentLabelContainer = styled.div({
  padding: "4px 8px",
  borderRadius: "4px",
  backgroundColor: "#333",
  color: "#fff",
  fontSize: "12px",
})

const SegmentLabel = ({ label, value }: { label: string; value: number }) => (
  <SegmentLabelContainer>
    {label}: {value}%
  </SegmentLabelContainer>
)

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
      <DistributionBarLayout>
        {segments.map((segment, index) => (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger asChild>
              <Segment color={segment.color} width={segment.value} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="top" align="center" sideOffset={5}>
                <SegmentLabel label={segment.label} value={segment.value} />
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
        {totalValue < 100 && <FillerSegment style={{ width: `${100 - totalValue}%` }} />}
      </DistributionBarLayout>
    </Tooltip.Provider>
  )
}
