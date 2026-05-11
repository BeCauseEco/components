import { Color, computeColor } from "@new/Color"
import { ProgressIndicatorItemSegmentProps } from "@new/ProgressIndicator/ProgressIndicatorSegment"
import { ProgressIndicatorItemTickProps } from "@new/ProgressIndicator/ProgressIndicatorTick"
import { Children, isValidElement, ReactElement } from "react"
import ReactIs from "react-is"

export type ProgressIndicatorProps = {
  type: "bar" | "circle"
  size: "small" | "large"
  color: Color
  labelStart?: string
  labelEnd?: string
  children:
    | ReactElement<ProgressIndicatorItemSegmentProps | ProgressIndicatorItemTickProps>
    | ReactElement<ProgressIndicatorItemSegmentProps | ProgressIndicatorItemTickProps>[]
}

const clipPathDoughnut =
  "polygon(100% 50%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 50%, 72.5% 50%,72.03942367818112% 45.470783298005145%,70.67655076145519% 41.12699325995033%,68.46717742716372% 37.14646516036717%,65.50175567920294% 33.6921622873448%,61.90169023235666% 30.905504206368104%,57.814368189008455% 28.90057702669069%,53.407124993852975% 27.759462702617494%,48.86039370112896% 27.528878588651313%,44.36031802417879% 28.218264825510403%,40.09113158995323% 29.799397859658313%,36.227615392677585% 32.207545918901786%,32.927942239412204% 35.34411913875%,30.327201136746904% 39.08070584305068%,28.531866730998903% 43.264329733099444%,27.61544022368236% 47.723712755282776%,27.61544022368236% 52.276287244717224%,28.531866730998896% 56.73567026690054%,30.327201136746904% 60.91929415694933%,32.927942239412204% 64.65588086125%,36.22761539267759% 67.79245408109821%,40.091131589953214% 70.20060214034169%,44.36031802417879% 71.7817351744896%,48.86039370112896% 72.47112141134869%,53.407124993852975% 72.2405372973825%,57.814368189008434% 71.09942297330932%,61.90169023235666% 69.09449579363189%,65.50175567920294% 66.3078377126552%,68.46717742716372% 62.85353483963283%,70.67655076145519% 58.873006740049675%,72.03942367818112% 54.529216701994855%,72.5% 50.00000000000001%)"

const DIAGONAL_PATTERN = "repeating-linear-gradient(-45deg, transparent, transparent 2px, black 2px, black 4px)"
const DOTTED_PATTERN = "radial-gradient(black 1px, transparent 1px)"

export const ProgressIndicator = (p: ProgressIndicatorProps) => {
  const childrenArray = Children.toArray(p.children)
  const trackColor = computeColor([p.color, 50])
  const labelColor = computeColor([p.color, 400])
  const labelSizeClass = p.size === "small" ? "text-xs" : "text-sm"
  const gapClass = p.size === "small" ? "gap-1" : "gap-2"

  const labelStartEl = p.labelStart ? (
    <span className={`tw shrink-0 font-mono ${labelSizeClass}`} style={{ color: labelColor }}>
      {p.labelStart}
    </span>
  ) : null

  const labelEndEl = p.labelEnd ? (
    <span className={`tw min-w-[4ch] shrink-0 text-right font-mono ${labelSizeClass}`} style={{ color: labelColor }}>
      {p.labelEnd}
    </span>
  ) : null

  if (p.type === "bar") {
    const outerHeightClass = p.size === "small" ? "h-6" : "h-8"
    const barHeightClass = p.size === "small" ? "h-2" : "h-4"

    const segments: ReactElement[] = []
    const ticks: ReactElement[] = []

    childrenArray.forEach((child, index) => {
      if (ReactIs.isFragment(child)) {
        return
      }
      if (!isValidElement<ProgressIndicatorItemSegmentProps | ProgressIndicatorItemTickProps>(child)) {
        return
      }

      if ("offset" in child.props) {
        const cp = child.props as ProgressIndicatorItemTickProps
        ticks.push(
          <div
            key={`tick-${index}`}
            className="tw absolute top-0 z-[1] h-full"
            style={{
              left: `calc(${cp.offset} - calc(var(--BU) + calc(var(--BU) * 0.5)))`,
              width: "calc(var(--BU) * 2)",
              borderLeft: `solid calc(var(--BU) * 0.5) ${computeColor([cp.color, 50])}`,
              borderRight: `solid calc(var(--BU) * 0.5) ${computeColor([cp.color, 50])}`,
              backgroundColor: computeColor([cp.color, 700]),
            }}
          />,
        )
      } else {
        const cp = child.props as ProgressIndicatorItemSegmentProps
        segments.push(
          <div
            key={`seg-${index}`}
            title={cp.width}
            className="tw h-full"
            style={{
              width: cp.width,
              backgroundColor: computeColor([cp.color, 700]),
            }}
          />,
        )
      }
    })

    return (
      <div className={`tw flex w-full items-center ${gapClass}`}>
        {labelStartEl}
        <div className={`tw flex min-w-0 flex-1 items-center ${outerHeightClass}`}>
          <div
            className={`tw relative w-full overflow-hidden rounded-[var(--BU)] ${barHeightClass}`}
            style={{ backgroundColor: trackColor }}
          >
            <div
              aria-hidden
              className="tw pointer-events-none absolute inset-0 opacity-[0.05] print:hidden"
              style={{ backgroundImage: DIAGONAL_PATTERN }}
            />
            <div className="tw absolute inset-0 flex">{segments}</div>
            {ticks}
          </div>
        </div>
        {labelEndEl}
      </div>
    )
  }

  const gradients: string[] = []
  let previousWidth = 0
  let totalWidth = 0

  childrenArray.forEach(child => {
    if (!isValidElement(child)) {
      return
    }
    const cp = child.props as ProgressIndicatorItemSegmentProps
    const width = parseInt(cp.width, 10)
    const color = cp.color

    gradients.push(`${computeColor([color, 700])} ${previousWidth}% ${previousWidth + width}%`)
    previousWidth += width
    totalWidth += width
  })
  gradients.push(`transparent ${totalWidth}% 100%`)

  const circleHeightClass = p.size === "small" ? "h-6" : "h-8"

  return (
    <div className={`tw flex w-full items-center ${gapClass}`}>
      {labelStartEl}
      <div className={`tw relative aspect-square shrink-0 ${circleHeightClass}`}>
        <div
          aria-hidden
          className="tw absolute inset-0 rounded-full print:hidden"
          style={{
            backgroundColor: trackColor,
            clipPath: clipPathDoughnut,
          }}
        />
        <div
          aria-hidden
          className="tw pointer-events-none absolute inset-0 rounded-full opacity-[0.075] print:hidden"
          style={{
            backgroundImage: DOTTED_PATTERN,
            backgroundSize: "3px 3px",
            clipPath: clipPathDoughnut,
          }}
        />
        <div
          className="tw absolute inset-0 z-[1] rounded-full"
          style={{
            background: `conic-gradient(${gradients.join(",")})`,
            clipPath: clipPathDoughnut,
          }}
        />
      </div>
      {labelEndEl}
    </div>
  )
}
