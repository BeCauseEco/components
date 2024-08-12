import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { ESize } from "@new/ESize"

const StyleSizeSmall = {
  padding: "var(--BU) calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
}

const StyleSizeMedium = {
  padding: "calc(var(--BU) * 1.5) calc(var(--BU) * 3)",
  borderRadius: "var(--BU)",
}

const StyleSizeLarge = {
  padding: "calc(var(--BU) * 2) calc(var(--BU) * 4)",
  borderRadius: "var(--BU)",
}

const Container = styled.div<Pick<TLayoutInputButton, "size">>(p => ({
  display: "flex",
  width: "100%",
  cursor: "pointer",

  ...(p.size === ESize.Small && StyleSizeSmall),
  ...(p.size === ESize.Medium && StyleSizeMedium),
  ...(p.size === ESize.Large && StyleSizeLarge),
}))

export type TLayoutInputButton = TLayoutBase & {
  content: ReactNode
  size: ESize
}

export const LayoutInputButton = ({ content, size }: TLayoutInputButton) => {
  return (
    <Container className="layout-container" size={size}>
      {content}
    </Container>
  )
}
