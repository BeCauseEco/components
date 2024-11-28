import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconSecondaryProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "destructive" | "playwrightTestId"
> & {
  iconName: string
}

export const InputButtonIconSecondary = forwardRef<HTMLButtonElement, InputButtonIconSecondaryProps>((p, ref) => {
  return (
    <InputButton
      className="<InputButtonIconSecondary /> -"
      id={p.id}
      ref={ref}
      variant="outlined"
      size={p.size}
      width="auto"
      colorForeground={[Color.Primary, 700]}
      colorOutline={[Color.Primary, 300]}
      colorBackgroundHover={[Color.Primary, 100]}
      colorLoading={[Color.Primary, 700]}
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
