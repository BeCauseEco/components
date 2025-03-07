import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color, ColorWithLightness } from "@new/Color"

export type InputButtonIconTertiaryProps = Pick<
  InputButtonProps,
  | "id"
  | "size"
  | "hug"
  | "loading"
  | "disabled"
  | "onClick"
  | "preventDefault"
  | "destructive"
  | "data-playwright-testid"
> & {
  iconName: string
  colorForeground?: ColorWithLightness
  colorBackgroundHover?: ColorWithLightness
}

export const InputButtonIconTertiary = forwardRef<HTMLButtonElement, InputButtonIconTertiaryProps>((p, ref) => {
  return (
    <InputButton
      className="<InputButtonIconTertiary /> -"
      id={p.id}
      ref={ref}
      variant="transparent"
      size={p.size}
      width="auto"
      colorForeground={p.colorForeground || [Color.Primary, 700]}
      colorBackgroundHover={p.colorBackgroundHover || [Color.Primary, 100]}
      colorLoading={[Color.Primary, 700]}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      destructive={p.destructive}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      onClick={p.onClick}
      preventDefault={p.preventDefault}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
