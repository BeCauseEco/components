import { EDirection } from "@new/EDirection"
import { LayoutSplitBase, TLayoutSplitBase } from "./internal/LayoutSplitBase"
import { ELayoutSplitFocus } from "./ELayoutSplitFocus"

export type TLayoutSplitHorizontal = Omit<TLayoutSplitBase, "direction"> & {
  focus: ELayoutSplitFocus.Equal | ELayoutSplitFocus.Left | ELayoutSplitFocus.Right
}

export const LayoutSplitHorizontal = ({ children, focus, omitPadding, playwrightTestId }: TLayoutSplitHorizontal) => {
  return (
    <LayoutSplitBase
      focus={focus}
      omitPadding={omitPadding}
      direction={EDirection.Horizontal}
      playwrightTestId={playwrightTestId}
    >
      {children}
    </LayoutSplitBase>
  )
}
