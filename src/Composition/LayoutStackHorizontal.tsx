import { EDirection } from "@new/EDirection"
import { LayoutStackBase, TLayoutStackBase } from "./internal/LayoutStackBase"

export type TLayoutStackHorizontal = Omit<TLayoutStackBase, "direction">

export const LayoutStackHorizontal = ({ children, omitPadding, playwrightTestId }: TLayoutStackHorizontal) => {
  return (
    <LayoutStackBase omitPadding={omitPadding} direction={EDirection.Horizontal} playwrightTestId={playwrightTestId}>
      {children}
    </LayoutStackBase>
  )
}
