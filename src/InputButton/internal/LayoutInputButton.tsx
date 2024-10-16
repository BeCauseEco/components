import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"
import { ESize } from "@new/ESize"

const StyleSizeSmall = childIconOnly => ({
  padding: childIconOnly ? "var(--BU)" : "0 calc(var(--BU) * 2)",
  height: "calc(var(--BU) * 6)",
  borderRadius: "var(--BU)",
})

const StyleSizeMedium = childIconOnly => ({
  padding: childIconOnly ? "calc(var(--BU) * 1.5)" : "0 calc(var(--BU) * 3)",
  height: "calc(var(--BU) * 8)",
  borderRadius: "var(--BU)",
})

const StyleSizeLarge = childIconOnly => ({
  padding: childIconOnly ? "calc(var(--BU) * 2)" : "0 calc(var(--BU) * 4)",
  height: "calc(var(--BU) * 10)",
  borderRadius: "var(--BU)",
})

const Container = styled.div<Pick<TLayoutInputButton, "size" | "childIconOnly" | "omitPadding">>(p => ({
  display: "flex",
  width: "100%",
  cursor: "pointer",
  alignItems: "center",

  ...(p.size === ESize.Small && StyleSizeSmall(p.childIconOnly)),
  ...(p.size === ESize.Medium && StyleSizeMedium(p.childIconOnly)),
  ...(p.size === ESize.Large && StyleSizeLarge(p.childIconOnly)),

  ...(p.omitPadding && { padding: 0 }),
}))

export type TLayoutInputButton = TLayoutBase & {
  content: ReactNode | ReactNode[]
  size: ESize
  childIconOnly: boolean
  omitPadding?: boolean
}

export const LayoutInputButton = ({ content, size, childIconOnly, omitPadding }: TLayoutInputButton) => {
  return (
    <Container className="layout-container" size={size} childIconOnly={childIconOnly} omitPadding={omitPadding}>
      {content}
    </Container>
  )
}
