import styled from "@emotion/styled"
import { PropsWithChildren, forwardRef } from "react"

const Container = styled.output<TButton & { override: string }>(p => ({
  display: "flex",
  content: p.override,
}))

export enum EButtonType {
  Button,
  Link,
}

export type TButton = {
  type: EButtonType
}

export default forwardRef<HTMLButtonElement | HTMLAnchorElement, PropsWithChildren<TButton>>((props, ref) => {
  const { type, children } = props

  console.log(type)

  return (
    <Container ref={ref} {...(props as any)}>
      {children}
    </Container>
  )
})
