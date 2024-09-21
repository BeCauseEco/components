import { EDirection } from "@new/EDirection"
import { LayoutMultipleBase, TLayoutMultipleBase } from "./internal/LayoutMultipleBase"

export type TLayoutMultipleHorizontal = Omit<TLayoutMultipleBase, "direction">

export const LayoutMultipleHorizontal = ({ children, omitPadding, playwrightTestId }: TLayoutMultipleHorizontal) => {
  return (
    <LayoutMultipleBase omitPadding={omitPadding} direction={EDirection.Horizontal} playwrightTestId={playwrightTestId}>
      {children}
    </LayoutMultipleBase>
  )
}
