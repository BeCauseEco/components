import { ESize } from "@new/ESize"
import styled from "@emotion/styled"

const Container = styled.div<TSpacer>(p => ({
  display: "flex",
  flexShrink: 0,
  width: p.size,
  height: p.size,
}))

export type TSpacer = {
  size: ESize
}

export const Spacer = ({ size }: TSpacer) => {
  return <Container size={size} />
}
