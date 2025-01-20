import { Color, computeColor } from "@new/Color"
import { ProgressIndicatorItemProps } from "@new/ProgressIndicator/ProgressIndicatorItem"
import { Children, isValidElement, ReactElement } from "react"
import styled from "@emotion/styled"

export type ProgressIndicatorProps = {
  type: "bar" | "circle"
  size: "small" | "large"
  color: Color
  labelStart?: string
  labelEnd?: string
  children: ReactElement<ProgressIndicatorItemProps> | ReactElement<ProgressIndicatorItemProps>[]
}

type Segment = {
  width: string
  color: Color
}

const clipPathDoughnut =
  "polygon(100% 50%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 50%, 72.5% 50%,72.03942367818112% 45.470783298005145%,70.67655076145519% 41.12699325995033%,68.46717742716372% 37.14646516036717%,65.50175567920294% 33.6921622873448%,61.90169023235666% 30.905504206368104%,57.814368189008455% 28.90057702669069%,53.407124993852975% 27.759462702617494%,48.86039370112896% 27.528878588651313%,44.36031802417879% 28.218264825510403%,40.09113158995323% 29.799397859658313%,36.227615392677585% 32.207545918901786%,32.927942239412204% 35.34411913875%,30.327201136746904% 39.08070584305068%,28.531866730998903% 43.264329733099444%,27.61544022368236% 47.723712755282776%,27.61544022368236% 52.276287244717224%,28.531866730998896% 56.73567026690054%,30.327201136746904% 60.91929415694933%,32.927942239412204% 64.65588086125%,36.22761539267759% 67.79245408109821%,40.091131589953214% 70.20060214034169%,44.36031802417879% 71.7817351744896%,48.86039370112896% 72.47112141134869%,53.407124993852975% 72.2405372973825%,57.814368189008434% 71.09942297330932%,61.90169023235666% 69.09449579363189%,65.50175567920294% 66.3078377126552%,68.46717742716372% 62.85353483963283%,70.67655076145519% 58.873006740049675%,72.03942367818112% 54.529216701994855%,72.5% 50.00000000000001%)"

const Container = styled.div<Pick<ProgressIndicatorProps, "type" | "size" | "color">>(p => ({
  display: "flex",
  position: "relative",
  ...(p.type === "bar" && { width: "100%" }),
  height: p.size === "small" ? "calc(var(--BU) * 6)" : "calc(var(--BU) * 8)",
  padding: p.type === "bar" ? "calc(var(--BU) * 2) 0" : "none",
  zIndex: 0,
  overflow: "hidden",

  "&:before": {
    "@media print": {
      display: "none",
    },

    content: '""',
    display: "flex",
    position: "absolute",
    width: "100%",
    left: 0,
    backgroundColor: computeColor([p.color, 50]),

    ...(p.type === "bar"
      ? {
          height: "calc(100% - var(--BU) * 4)",
          top: "calc(var(--BU) * 2)",
          outlineOffset: "-1px",
          clipPath: "inset(0 0 0 0 round var(--BU))",
        }
      : {
          height: "100%",
          aspectRatio: "1 / 1",
          top: 0,
          clipPath: clipPathDoughnut,
          borderRadius: "50%",
        }),
  },

  "&:after": {
    "@media print": {
      display: "none",
    },

    content: '""',
    display: "flex",
    position: "absolute",
    left: 0,

    ...(p.type === "bar"
      ? {
          width: "100%",
          height: "calc(100% - var(--BU) * 4)",
          top: "calc(var(--BU) * 2)",
          clipPath: "inset(0 0 0 0 round var(--BU))",
          opacity: 0.05,
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            black 2px,
            black 4px
          )`,
        }
      : {
          aspectRatio: "1 / 1",
          height: "100%",
          top: 0,
          borderRadius: "50%",
          backgroundImage: "radial-gradient(black 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          opacity: 0.075,
          clipPath: clipPathDoughnut,
        }),
  },
}))

const SegmentContainer = styled.div({
  display: "flex",
  width: "100%",
  height: "100%",
  clipPath: "inset(0 0 0 0 round var(--BU))",
  zIndex: 1,
})

const SegmentBar = styled.div<Segment>(p => ({
  display: "flex",
  width: p.width,
  height: "100%",
  backgroundColor: computeColor([p.color, 700]),
}))

const SegmentCircle = styled.div<{ background: string }>(p => ({
  display: "flex",
  height: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "50%",
  zIndex: 1,
  background: p.background,
  clipPath: clipPathDoughnut,
}))

export const ProgressIndicator = (p: ProgressIndicatorProps) => {
  // const precision = 32
  // const radius = 22.5

  // const c = [...Array(precision)].map((_, i) => {
  //   const a = (-i / (precision - 1)) * Math.PI * 2
  //   const x = Math.cos(a) * radius + 50
  //   const y = Math.sin(a) * radius + 50
  //   return `${x}% ${y}%`
  // })

  // console.log(`clipPath: "polygon(100% 50%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 50%, ${c.join(",")})"`)

  const childrenArray = Children.toArray(p.children)
  const output: ReactElement[] = []

  if (p.type === "bar") {
    childrenArray.map((child, index) => {
      if (isValidElement(child)) {
        output.push(
          <SegmentBar
            key={index}
            title={child.props["width"]}
            width={child.props["width"]}
            color={child.props["color"]}
          />,
        )
      }
    })
  } else {
    const gradients: string[] = []

    let previousWidth = 0
    let totalWidth = 0

    childrenArray.map(child => {
      if (isValidElement(child)) {
        const width = parseInt(child.props["width"], 10)
        const color = child.props["color"]

        gradients.push(
          `
            ${computeColor([color, 700])}
            ${previousWidth}%
            ${previousWidth + width}%
          `,
        )

        previousWidth = previousWidth + width
        totalWidth += width
      }
    })

    gradients.push(`transparent ${totalWidth}% 100%`)

    output.push(<SegmentCircle background={`conic-gradient(${gradients.join(",")})`} />)
  }

  return (
    <Container type={p.type} size={p.size} color={p.color}>
      <SegmentContainer>{output}</SegmentContainer>
    </Container>
  )
}
