import { EDirection } from "@new/EDirection"
import { LayoutDoubleBase, TLayoutDoubleBase } from "./internal/LayoutDoubleBase"
import { ELayoutDoubleFocus } from "./ELayoutDoubleFocus"

export type TLayoutDoubleVertical = Omit<TLayoutDoubleBase, "direction" | "focus">

export const LayoutDoubleVertical = ({ children, omitPadding, playwrightTestId }: TLayoutDoubleVertical) => {
  return (
    <LayoutDoubleBase
      focus={ELayoutDoubleFocus.None}
      omitPadding={omitPadding}
      direction={EDirection.Vertical}
      playwrightTestId={playwrightTestId}
    >
      {children}
    </LayoutDoubleBase>
  )
}
