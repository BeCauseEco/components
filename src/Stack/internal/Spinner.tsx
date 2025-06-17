import styled from "@emotion/styled"
import { StackProps } from "../Stack"
import { keyframes } from "@emotion/react"
import { computeColor, Color } from "@new/Color"
import { makePropsNonTransient } from "@new/_internal/emotionUtilities"

const keyframeA = keyframes({
  "0%": { clipPath: "polygon(50% 50%, 0 0,50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0% )" },
  "12.5%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0% )" },
  "25%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100%   0%, 100% 100%, 100% 100%, 100% 100% )" },
  "50%": { clipPath: "polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100% )" },
  "62.5%": { clipPath: "polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100% )" },
  "75%": { clipPath: "polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100% )" },
  "100%": { clipPath: "polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100% )" },
})

const keyframeB = keyframes({
  "0%": { transform: "scaleY(1) rotate(0deg)" },
  "49.99%": { transform: "scaleY(1) rotate(135deg)" },
  "50%": { transform: "scaleY(-1) rotate(0deg)" },
  "100%": { transform: "scaleY(-1) rotate(-135deg)" },
})

export const Spinner = styled(
  "div",
  makePropsNonTransient(["loading"]),
)<Pick<StackProps, "loading" | "fillLoading">>(p => ({
  diplay: "flex",
  height: "100%",
  aspectRatio: "1",
  borderRadius: "50%",
  border: `1px solid ${computeColor(p.fillLoading || [Color.Transparent])}`,
  animation: `${keyframeA} 0.8s infinite linear alternate, ${keyframeB} 1.6s infinite linear;`,
  opacity: p.loading ? 1 : 0,

  "@container (height > 16px)": {
    height: "50%",
    border: `2px solid ${computeColor(p.fillLoading || [Color.Transparent])}`,
  },

  "@container (height > 40px)": {
    height: "50%",
    border: `3px solid ${computeColor(p.fillLoading || [Color.Transparent])}`,
  },
}))
