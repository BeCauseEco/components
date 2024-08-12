import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
import ReportIcon from "public/assets/icons/placeholders/reportIcon.svg"
import { TText } from "@new/Text/Text"
import { ESize } from "@new/ESize"
import { Spacer } from "@new/Spacer/Spacer"
import { ReactElement } from "react"
import { TInputButton } from "@new/InputButton/InputButton"
import { TInputComboboxItem } from "@new/InputCombobox/InputComboboxItem"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 4)",
  justifyContent: "center",
  alignItems: "center",
})

export type TLayoutEmptyState = TLayoutBase & {
  head: ReactElement<TText>
  body: ReactElement<TText>
  content?: ReactElement<TInputButton | TInputComboboxItem>
}

export const LayoutEmptyState = ({ head, body, content }: TLayoutEmptyState) => {
  return (
    <Container className="layout-container">
      <ReportIcon />

      <Spacer size={ESize.Large} />

      {head}

      <Spacer size={ESize.Medium} />

      {body}

      {content && <Spacer size={ESize.Large} />}

      {content && content}

      {content && <Spacer size={ESize.Large} />}
    </Container>
  )
}
