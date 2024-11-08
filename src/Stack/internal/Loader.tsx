import styled from "@emotion/styled"
import { StackProps } from "../Stack"

export const Loader = styled.div<Pick<StackProps, "loading">>(p => ({
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
