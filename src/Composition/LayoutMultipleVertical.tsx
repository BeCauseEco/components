import { EDirection } from "@new/EDirection"
import { LayoutMultipleBase, TLayoutMultipleBase } from "./internal/LayoutMultipleBase"

export type TLayoutMultipleVertical = Omit<TLayoutMultipleBase, "direction">

export const LayoutMultipleVertical = ({ children, omitPadding, playwrightTestId }: TLayoutMultipleVertical) => {
  return (
    <LayoutMultipleBase omitPadding={omitPadding} direction={EDirection.Vertical} playwrightTestId={playwrightTestId}>
      {children}
    </LayoutMultipleBase>
  )
}
