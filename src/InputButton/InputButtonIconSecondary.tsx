import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color, ColorWithLightness } from "@new/Color"

export type InputButtonIconSecondaryProps = Pick<
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
  customOutline?: ColorWithLightness
  customColor?: Color
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
      colorForeground={[p.customColor || Color.Primary, 700]}
      colorOutline={p.customOutline || [p.customColor || Color.Primary, 700]}
      colorBackgroundHover={[p.customColor || Color.Primary, 100]}
      colorLoading={[p.customColor || Color.Primary, 700]}
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
