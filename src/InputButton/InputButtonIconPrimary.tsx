import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconPrimaryProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "destructive" | "playwrightTestId"
> & {
  iconName: string
}

export const InputButtonIconPrimary = forwardRef<HTMLButtonElement, InputButtonIconPrimaryProps>((p, ref) => {
  return (
    <InputButton
      id={p.id}
      ref={ref}
      variant="solid"
      size={p.size}
      colorForeground={[Color.Primary, 50]}
      colorBackground={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 800]}
      colorLoading={[Color.Primary, 50]}
      hug={p.hug}
      loading={p.loading}
      disabled={p.disabled}
      destructive={p.destructive}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      onClick={p.onClick}
      playwrightTestId={p.playwrightTestId}
    />
  )
})
