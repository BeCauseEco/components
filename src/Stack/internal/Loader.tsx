import styled from "@emotion/styled"
import { StackProps } from "../Stack"
import { makePropsNonTransient } from "@new/_internal/emotionUtilities"

export const Loader = styled(
  "div",
  makePropsNonTransient(["loading"]),
)<Pick<StackProps, "loading">>(p => ({
  display: p.loading ? "flex" : "none",
  position: "absolute",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 0,
  cursor: "inherit",
  containerType: "size",
  overflow: "hidden",
}))
