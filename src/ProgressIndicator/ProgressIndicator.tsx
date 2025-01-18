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

const Container = styled.div<Pick<ProgressIndicatorProps, "type" | "size" | "color">>(p => ({
  display: "flex",
  ...(p.type === "bar" && { width: "100%" }),
  position: "relative",
  height: p.size === "small" ? "calc(var(--BU) * 6)" : "calc(var(--BU) * 8)",
  padding: "calc(var(--BU) * 1) 0",
  zIndex: 0,

  "&:before": {
    content: '""',
    display: "flex",
    position: "absolute",
    ...(p.type === "bar" && { width: "100%" }),
    ...(p.type === "circle" && { aspectRatio: "1 / 1" }),
    height: "calc(100% - var(--BU) * 2)",
    top: "calc(var(--BU) * 1)",
    left: 0,
    backgroundColor: computeColor([p.color, 50]),
    borderRadius: p.type === "bar" ? "var(--BU)" : "50%",
  },

  "&:after": {
    content: '""',
    display: "flex",
    position: "absolute",
    ...(p.type === "bar" && { width: "100%" }),
    ...(p.type === "circle" && { aspectRatio: "1 / 1" }),
    height: "calc(100% - var(--BU) * 2)",
    top: "calc(var(--BU) * 1)",
    left: 0,
    opacity: "0.05",
    borderRadius: p.type === "bar" ? "var(--BU)" : "50%",

    background: `repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 2px,
      black 2px,
      black 4px
    )`,
  },
}))

const SegmentBar = styled.div<Segment>(p => ({
  display: "flex",
  width: p.width,
  height: "100%",
  backgroundColor: computeColor([p.color, 700]),
  zIndex: 1,

  "&:first-child": {
    borderTopLeftRadius: "var(--BU)",
    borderBottomLeftRadius: "var(--BU)",
  },

  "&:last-child:not(:first-child)": {
    borderTopRightRadius: "var(--BU)",
    borderBottomRightRadius: "var(--BU)",
  },
}))

const SegmentCircle = styled.div<{ background: string }>(p => ({
  display: "flex",
  height: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "50%",
  zIndex: 1,
  background: p.background,
}))

// .pie {
//   height: 100px;
//   width: 100px;
//   border-radius: 50%;
//   background: conic-gradient(
//           deepskyblue 0% 25%,
//           orangered 25% 85%,
//           #FFFFFF 85%
//   );
// }

export const ProgressIndicator = (p: ProgressIndicatorProps) => {
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
    const gradient: string[] = []

    let previousWidth = 0
    let currentWidth = 0

    childrenArray.map(child => {
      if (isValidElement(child)) {
        currentWidth = parseFloat(child.props["width"])
        const color = computeColor([child.props["color"], 700])

        gradient.push(`${color} ${previousWidth}% ${currentWidth + previousWidth}%`)

        previousWidth = parseFloat(child.props["width"])
      }
    })

    gradient.push(`transparent ${currentWidth + childrenArray.length === 1 ? 0 : previousWidth}% 100%`)

    output.push(<SegmentCircle background={`conic-gradient(${gradient.join(",")})`} />)
  }

  return (
    <Container type={p.type} size={p.size} color={p.color}>
      {output}
    </Container>
  )
}
