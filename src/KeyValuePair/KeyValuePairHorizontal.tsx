import styled from "@emotion/styled"
import { ESize } from "@new/ESize"
import { forwardRef, PropsWithChildren, ReactElement } from "react"
import { Spacer } from "@new/Spacer/Spacer"
import { EDistribution } from "@new/EDistrubution"
import { TPlaywright } from "@new/TPlaywright"
import { TAlign } from "@new/Align/Align"

const Container = styled.div<Pick<TKeyValuePairHorizontal, "itemDistribution">>(p => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: p.itemDistribution ? p.itemDistribution : "normal",
  width: "100%",
  pointerEvents: "none",
}))

const Content = styled.div({
  display: "flex",
  height: "100%",
  lineHeight: "inherit",
  alignItems: "center",

  "& *": {
    pointerEvents: "all",
  },
})

export type TKeyValuePairHorizontal = TPlaywright & {
  spacing: ESize
  children: [ReactElement<TAlign> | null | undefined, ReactElement<TAlign> | null | undefined]
  itemDistribution: EDistribution
}

export const KeyValuePairHorizontal = forwardRef<HTMLDivElement, PropsWithChildren<TKeyValuePairHorizontal>>(
  (props, ref) => {
    const { spacing, children, playwrightTestId } = props

    return (
      <Container ref={ref} data-playwright-testid={playwrightTestId} {...props}>
        <Content>{children[0]}</Content>

        {children[0] && <Spacer size={spacing} />}

        <Content>{children[1]}</Content>
      </Container>
    )
  },
)
