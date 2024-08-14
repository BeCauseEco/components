import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { ESize } from "@new/ESize"

const StyleSizeSmall = childIconOnly => ({
  padding: childIconOnly ? "var(--BU)" : "var(--BU) calc(var(--BU) * 2)",
  borderRadius: "var(--BU)",
})

const StyleSizeMedium = childIconOnly => ({
  padding: childIconOnly ? "calc(var(--BU) * 1.5)" : "calc(var(--BU) * 1.5) calc(var(--BU) * 3)",
  borderRadius: "var(--BU)",
})

const StyleSizeLarge = childIconOnly => ({
  padding: childIconOnly ? "calc(var(--BU) * 2)" : "calc(var(--BU) * 2) calc(var(--BU) * 4)",
  borderRadius: "var(--BU)",
})

const Container = styled.div<Pick<TLayoutInputButton, "size" | "childIconOnly">>(p => ({
  display: "flex",
  width: "100%",

  ...(p.size === ESize.Small && StyleSizeSmall(p.childIconOnly)),
  ...(p.size === ESize.Medium && StyleSizeMedium(p.childIconOnly)),
  ...(p.size === ESize.Large && StyleSizeLarge(p.childIconOnly)),
}))

export type TLayoutInputButton = TLayoutBase & {
  content: ReactNode
  size: ESize
  childIconOnly: boolean
}

export const LayoutInputButton = ({ content, size, childIconOnly }: TLayoutInputButton) => {
  return (
    <Container className="layout-container" size={size} childIconOnly={childIconOnly}>
      {content}
    </Container>
  )
}
