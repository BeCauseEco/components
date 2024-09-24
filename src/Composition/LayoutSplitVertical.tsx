import { EDirection } from "@new/EDirection"
import { LayoutSplitBase, TLayoutSplitBase } from "./internal/LayoutSplitBase"
import { ELayoutSplitFocus } from "./ELayoutSplitFocus"

export type TLayoutSplitVertical = Omit<TLayoutSplitBase, "direction" | "focus">

export const LayoutSplitVertical = ({ children, omitPadding, playwrightTestId }: TLayoutSplitVertical) => {
  return (
    <LayoutSplitBase
      focus={ELayoutSplitFocus.None}
      omitPadding={omitPadding}
      direction={EDirection.Vertical}
      playwrightTestId={playwrightTestId}
    >
      {children}
    </LayoutSplitBase>
  )
}
