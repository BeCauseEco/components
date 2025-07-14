import { ToastViewport as RadixToastViewport } from "@radix-ui/react-toast"
import styled from "@emotion/styled"

export const ToastViewport = styled(RadixToastViewport)({
  "--viewport-padding": "15px",
  padding: "var(--viewport-padding)",
  paddingTop: "calc(var(--viewport-padding) + 55px)",
  position: "fixed",
  top: 0,
  right: 0,
  width: "350px",
  listStyle: "none",
  zIndex: 2147483647,
})
