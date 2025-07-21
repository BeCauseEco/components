import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color, ColorWithLightness } from "@new/Color"

export type InputButtonSecondaryProps = Pick<
  InputButtonProps,
  | "id"
  | "size"
  | "title"
  | "width"
  | "hug"
  | "loading"
  | "disabled"
  | "onClick"
  | "preventDefault"
  | "href"
  | "destructive"
  | "data-playwright-testid"
> & {
  label: string
  transparent?: boolean
  iconNameLeft?: string
  iconNameRight?: string
}

export const InputButtonSecondary = forwardRef<HTMLButtonElement, InputButtonSecondaryProps>((p, ref) => {
  const iconName = p.iconNameLeft || p.iconNameRight
  let iconPlacement: InputButtonProps["iconPlacement"] = "beforeLabel"

  if (p.iconNameLeft) {
    iconPlacement = "beforeLabel"
  }

  if (p.iconNameRight) {
    iconPlacement = "afterLabel"
  }

  let colorBackground: ColorWithLightness | undefined = [Color.White, 100]
  if (p.destructive || p.transparent) {
    colorBackground = undefined
  }

  return (
    <InputButton
      className="<InputButtonSecondary /> -"
      id={p.id}
      ref={ref}
      variant="outlined"
      size={p.size}
      width={p.width}
      colorBackground={colorBackground}
      colorForeground={[Color.Primary, 700]}
      colorOutline={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 100]}
      colorLoading={[Color.Primary, 700]}
      label={p.label}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      destructive={p.destructive}
      iconName={iconName}
      iconPlacement={iconPlacement}
      onClick={p.onClick}
      preventDefault={p.preventDefault}
      href={p.href}
      data-playwright-testid={p["data-playwright-testid"]}
      title={p.title}
    />
  )
})
