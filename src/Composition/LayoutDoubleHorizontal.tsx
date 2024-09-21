import { EDirection } from "@new/EDirection"
import { LayoutDoubleBase, TLayoutDoubleBase } from "./internal/LayoutDoubleBase"
import { ELayoutDoubleFocus } from "./ELayoutDoubleFocus"

export type TLayoutDoubleHorizontal = Omit<TLayoutDoubleBase, "direction"> & {
  focus: ELayoutDoubleFocus.Equal | ELayoutDoubleFocus.Left | ELayoutDoubleFocus.Right
}

export const LayoutDoubleHorizontal = ({ children, focus, omitPadding, playwrightTestId }: TLayoutDoubleHorizontal) => {
  return (
    <LayoutDoubleBase
      focus={focus}
      omitPadding={omitPadding}
      direction={EDirection.Horizontal}
      playwrightTestId={playwrightTestId}
    >
      {children}
    </LayoutDoubleBase>
  )
}
