import styled from "@emotion/styled"
import { TStack } from "../Stack"

export const Loader = styled.div<Pick<TStack, "loading">>(p => ({
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
