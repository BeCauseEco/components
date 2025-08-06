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
  | "title"
  | "tabIndex"
> & {
  iconName: string
  customColor?: Color
  customColorWithLightness?: ColorWithLightness
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
      colorForeground={p.customColorWithLightness || [p.customColor || Color.Primary, 700]}
      colorBackgroundHover={p.customColorWithLightness || [p.customColor || Color.Primary, 100]}
      colorLoading={p.customColorWithLightness || [p.customColor || Color.Primary, 700]}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      destructive={p.destructive}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      title={p.title}
      onClick={p.onClick}
      preventDefault={p.preventDefault}
      tabIndex={p.tabIndex}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
