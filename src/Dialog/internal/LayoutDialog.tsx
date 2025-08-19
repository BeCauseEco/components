import { ReactNode } from "react"
import styled from "@emotion/styled"
import { TLayoutBase } from "@new/Composition/TLayoutBase"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxHeight: "inherit",
})

const ContentStart = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "calc(var(--BU) * 4)",
})

const ContentStartContent = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
})

const ContentMiddle = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flexGrow: 1,
})

const ContentCountEnd = styled.div({
  display: "flex",
  flexDirection: "row",
  padding: "calc(var(--BU) * 4)",
  justifyContent: "space-between",
})

const ContentCount = styled.div({
  display: "flex",
  alignSelf: "flex-start",
  flexDirection: "row",
  height: "100%",
  alignItems: "center",
})

const ContentEnd = styled.div({
  display: "flex",
  flexDirection: "row",
  alignSelf: "flex-end",
  justifyContent: "flex-end",
})

export type TLayoutDialog = TLayoutBase & {
  contentStart?: ReactNode | ReactNode[]
  contentMiddle: ReactNode | ReactNode[]
  buttonsText?: ReactNode
  contentEnd: ReactNode | ReactNode[]
  buttonClose: ReactNode
  omitPadding?: boolean
}

export const LayoutDialog = ({
  contentStart,
  contentMiddle,
  contentEnd,
  buttonClose,
  buttonsText,
  ...p
}: TLayoutDialog) => {
  return (
    <Container className="layout-container" data-playwright-testid={p["data-playwright-testid"]}>
      <ContentStart>
        <ContentStartContent>{contentStart}</ContentStartContent>

        <ContentStartContent>{buttonClose}</ContentStartContent>
      </ContentStart>

      <ContentMiddle>{contentMiddle}</ContentMiddle>

      <ContentCountEnd>
        <ContentCount>{buttonsText}</ContentCount>

        <ContentEnd>{contentEnd}</ContentEnd>
      </ContentCountEnd>
    </Container>
  )
}
