import { EDirection } from "@new/EDirection"
import { LayoutStackBase, TLayoutStackBase } from "./internal/LayoutStackBase"

export type TLayoutStackVertical = Omit<TLayoutStackBase, "direction">

export const LayoutStackVertical = ({ children, omitPadding, playwrightTestId }: TLayoutStackVertical) => {
  return (
    <LayoutStackBase omitPadding={omitPadding} direction={EDirection.Vertical} playwrightTestId={playwrightTestId}>
      {children}
    </LayoutStackBase>
  )
}
