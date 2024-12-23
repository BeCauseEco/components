import styled from "@emotion/styled"
import { TLayoutBase } from "./TLayoutBase"
import { TextProps } from "@new/Text/Text"
import { Spacer } from "@new/Stack/Spacer"
import { ReactElement } from "react"
import { InputButtonPrimaryProps } from "@new/InputButton/InputButtonPrimary"
import { InputComboboxProps } from "@new/InputCombobox/InputCombobox"

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "calc(var(--BU) * 4)",
  justifyContent: "center",
  alignItems: "center",
})

export type TLayoutEmptyState = TLayoutBase & {
  head: ReactElement<TextProps>
  body: ReactElement<TextProps>
  content?: ReactElement<InputButtonPrimaryProps | InputComboboxProps>
}

export const LayoutEmptyState = (p: TLayoutEmptyState) => {
  return (
    <Container className="layout-container" data-playwright-testid={p["data-playwright-testid"]}>
      <svg width="64" height="92" viewBox="0 0 64 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M27.6875 74.75C27.3063 74.75 26.9406 74.9015 26.671 75.171C26.4014 75.4406 26.25 75.8063 26.25 76.1875V79.0625C26.25 79.4437 26.0986 79.8094 25.829 80.079C25.5594 80.3485 25.1937 80.5 24.8125 80.5H13.3125C12.9313 80.5 12.5656 80.3485 12.296 80.079C12.0264 79.8094 11.875 79.4437 11.875 79.0625V67.5625C11.875 67.1813 12.0264 66.8156 12.296 66.546C12.5656 66.2765 12.9313 66.125 13.3125 66.125H24.8125C25.1937 66.125 25.5594 65.9735 25.829 65.704C26.0986 65.4344 26.25 65.0687 26.25 64.6875C26.25 64.3063 26.0986 63.9406 25.829 63.671C25.5594 63.4015 25.1937 63.25 24.8125 63.25H13.3125C12.1688 63.25 11.0719 63.7044 10.2631 64.5131C9.45435 65.3219 9 66.4188 9 67.5625V79.0625C9 80.2062 9.45435 81.3031 10.2631 82.1119C11.0719 82.9206 12.1688 83.375 13.3125 83.375H24.8125C25.9562 83.375 27.0531 82.9206 27.8619 82.1119C28.6706 81.3031 29.125 80.2062 29.125 79.0625V76.1875C29.125 75.8063 28.9736 75.4406 28.704 75.171C28.4344 74.9015 28.0687 74.75 27.6875 74.75ZM29.6483 39.2323L20.5 48.3805L17.1017 44.9823C16.8306 44.7204 16.4675 44.5755 16.0906 44.5788C15.7137 44.5821 15.3532 44.7332 15.0866 44.9998C14.8201 45.2663 14.6689 45.6268 14.6657 46.0037C14.6624 46.3806 14.8073 46.7438 15.0691 47.0149L19.4851 51.428C19.7547 51.6975 20.1203 51.8489 20.5014 51.8489C20.8826 51.8489 21.2482 51.6975 21.5177 51.428L31.6838 41.2649C31.9456 40.9938 32.0905 40.6306 32.0872 40.2537C32.0839 39.8768 31.9328 39.5163 31.6662 39.2498C31.3997 38.9832 31.0392 38.8321 30.6623 38.8288C30.2854 38.8255 29.9194 38.9704 29.6483 39.2323ZM21.9375 31.625H39.1875C39.5687 31.625 39.9344 31.4736 40.204 31.204C40.4735 30.9344 40.625 30.5687 40.625 30.1875C40.625 29.8063 40.4735 29.4406 40.204 29.171C39.9344 28.9014 39.5687 28.75 39.1875 28.75H21.9375C21.5563 28.75 21.1906 28.9014 20.921 29.171C20.6514 29.4406 20.5 29.8063 20.5 30.1875C20.5 30.5687 20.6514 30.9344 20.921 31.204C21.1906 31.4736 21.5563 31.625 21.9375 31.625ZM13.3125 57.5H24.8125C25.9562 57.5 27.0531 57.0456 27.8619 56.2369C28.6706 55.4281 29.125 54.3312 29.125 53.1875V50.3125C29.125 49.9313 28.9736 49.5656 28.704 49.296C28.4344 49.0265 28.0687 48.875 27.6875 48.875C27.3063 48.875 26.9406 49.0265 26.671 49.296C26.4014 49.5656 26.25 49.9313 26.25 50.3125V53.1875C26.25 53.5687 26.0986 53.9344 25.829 54.204C25.5594 54.4735 25.1937 54.625 24.8125 54.625H13.3125C12.9313 54.625 12.5656 54.4735 12.296 54.204C12.0264 53.9344 11.875 53.5687 11.875 53.1875V41.6875C11.875 41.3063 12.0264 40.9406 12.296 40.671C12.5656 40.4015 12.9313 40.25 13.3125 40.25H24.8125C25.1937 40.25 25.5594 40.0985 25.829 39.829C26.0986 39.5594 26.25 39.1937 26.25 38.8125C26.25 38.4313 26.0986 38.0656 25.829 37.796C25.5594 37.5265 25.1937 37.375 24.8125 37.375H13.3125C12.1688 37.375 11.0719 37.8293 10.2631 38.6381C9.45435 39.4469 9 40.5438 9 41.6875V53.1875C9 54.3312 9.45435 55.4281 10.2631 56.2369C11.0719 57.0456 12.1688 57.5 13.3125 57.5ZM29.6483 65.1072L20.5 74.2555L17.1017 70.8572C16.8306 70.5954 16.4675 70.4505 16.0906 70.4538C15.7137 70.4571 15.3532 70.6082 15.0866 70.8748C14.8201 71.1413 14.6689 71.5018 14.6657 71.8787C14.6624 72.2556 14.8073 72.6188 15.0691 72.8899L19.4851 77.303C19.7547 77.5725 20.1203 77.7239 20.5014 77.7239C20.8826 77.7239 21.2482 77.5725 21.5177 77.303L31.6838 67.1399C31.9456 66.8688 32.0905 66.5056 32.0872 66.1287C32.0839 65.7518 31.9328 65.3913 31.6662 65.1248C31.3997 64.8582 31.0392 64.7071 30.6623 64.7038C30.2854 64.7005 29.9194 64.8454 29.6483 65.1072ZM53.5625 74.75H36.3125C35.9313 74.75 35.5656 74.9015 35.296 75.171C35.0265 75.4406 34.875 75.8063 34.875 76.1875C34.875 76.5687 35.0265 76.9344 35.296 77.204C35.5656 77.4735 35.9313 77.625 36.3125 77.625H53.5625C53.9437 77.625 54.3094 77.4735 54.579 77.204C54.8485 76.9344 55 76.5687 55 76.1875C55 75.8063 54.8485 75.4406 54.579 75.171C54.3094 74.9015 53.9437 74.75 53.5625 74.75ZM56.4375 14.375H49.1034C48.7721 12.752 47.8904 11.2933 46.6074 10.2455C45.3244 9.19778 43.7189 8.62532 42.0625 8.625H40.625C40.625 6.33751 39.7163 4.14371 38.0988 2.5262C36.4813 0.908703 34.2875 0 32 0C29.7125 0 27.5187 0.908703 25.9012 2.5262C24.2837 4.14371 23.375 6.33751 23.375 8.625H21.9375C20.2811 8.62532 18.6756 9.19778 17.3926 10.2455C16.1096 11.2933 15.2279 12.752 14.8966 14.375H7.5625C5.65626 14.375 3.82809 15.1323 2.48017 16.4802C1.13225 17.8281 0.375 19.6563 0.375 21.5625V84.8125C0.375 86.7187 1.13225 88.5469 2.48017 89.8948C3.82809 91.2427 5.65626 92 7.5625 92H56.4375C58.3437 92 60.1719 91.2427 61.5198 89.8948C62.8677 88.5469 63.625 86.7187 63.625 84.8125V21.5625C63.625 19.6563 62.8677 17.8281 61.5198 16.4802C60.1719 15.1323 58.3437 14.375 56.4375 14.375ZM21.9375 11.5H24.8125C25.1937 11.5 25.5594 11.3485 25.829 11.079C26.0986 10.8094 26.25 10.4437 26.25 10.0625V8.625C26.25 7.10001 26.8558 5.63747 27.9341 4.55914C29.0125 3.4808 30.475 2.875 32 2.875C33.525 2.875 34.9875 3.4808 36.0659 4.55914C37.1442 5.63747 37.75 7.10001 37.75 8.625V10.0625C37.75 10.4437 37.9015 10.8094 38.171 11.079C38.4406 11.3485 38.8063 11.5 39.1875 11.5H42.0625C43.2062 11.5 44.3031 11.9544 45.1119 12.7631C45.9206 13.5719 46.375 14.6688 46.375 15.8125C46.375 16.9562 45.9206 18.0531 45.1119 18.8619C44.3031 19.6706 43.2062 20.125 42.0625 20.125H21.9375C20.7938 20.125 19.6969 19.6706 18.8881 18.8619C18.0794 18.0531 17.625 16.9562 17.625 15.8125C17.625 14.6688 18.0794 13.5719 18.8881 12.7631C19.6969 11.9544 20.7938 11.5 21.9375 11.5ZM60.75 84.8125C60.75 85.9562 60.2956 87.0531 59.4869 87.8619C58.6781 88.6706 57.5812 89.125 56.4375 89.125H7.5625C6.41875 89.125 5.32185 88.6706 4.5131 87.8619C3.70435 87.0531 3.25 85.9562 3.25 84.8125V21.5625C3.25 20.4188 3.70435 19.3219 4.5131 18.5131C5.32185 17.7044 6.41875 17.25 7.5625 17.25H14.8966C15.2279 18.873 16.1096 20.3317 17.3926 21.3795C18.6756 22.4272 20.2811 22.9997 21.9375 23H42.0625C43.7189 22.9997 45.3244 22.4272 46.6074 21.3795C47.8904 20.3317 48.7721 18.873 49.1034 17.25H56.4375C57.5812 17.25 58.6781 17.7044 59.4869 18.5131C60.2956 19.3219 60.75 20.4188 60.75 21.5625V84.8125ZM53.5625 43.125H36.3125C35.9313 43.125 35.5656 43.2765 35.296 43.546C35.0265 43.8156 34.875 44.1813 34.875 44.5625C34.875 44.9437 35.0265 45.3094 35.296 45.579C35.5656 45.8485 35.9313 46 36.3125 46H53.5625C53.9437 46 54.3094 45.8485 54.579 45.579C54.8485 45.3094 55 44.9437 55 44.5625C55 44.1813 54.8485 43.8156 54.579 43.546C54.3094 43.2765 53.9437 43.125 53.5625 43.125ZM53.5625 69H36.3125C35.9313 69 35.5656 69.1515 35.296 69.421C35.0265 69.6906 34.875 70.0563 34.875 70.4375C34.875 70.8187 35.0265 71.1844 35.296 71.454C35.5656 71.7235 35.9313 71.875 36.3125 71.875H53.5625C53.9437 71.875 54.3094 71.7235 54.579 71.454C54.8485 71.1844 55 70.8187 55 70.4375C55 70.0563 54.8485 69.6906 54.579 69.421C54.3094 69.1515 53.9437 69 53.5625 69ZM53.5625 48.875H36.3125C35.9313 48.875 35.5656 49.0265 35.296 49.296C35.0265 49.5656 34.875 49.9313 34.875 50.3125C34.875 50.6937 35.0265 51.0594 35.296 51.329C35.5656 51.5985 35.9313 51.75 36.3125 51.75H53.5625C53.9437 51.75 54.3094 51.5985 54.579 51.329C54.8485 51.0594 55 50.6937 55 50.3125C55 49.9313 54.8485 49.5656 54.579 49.296C54.3094 49.0265 53.9437 48.875 53.5625 48.875Z"
          fill="#DBDBDB"
        />
      </svg>

      <Spacer large />

      {p.head}

      <Spacer medium />

      {p.body}

      {p.content && <Spacer large />}

      {p.content && p.content}

      {p.content && <Spacer large />}
    </Container>
  )
}
