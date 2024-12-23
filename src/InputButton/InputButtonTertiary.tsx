import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonTertiaryProps = Pick<
  InputButtonProps,
  | "id"
  | "size"
  | "width"
  | "hug"
  | "loading"
  | "disabled"
  | "onClick"
  | "href"
  | "destructive"
  | "data-playwright-testid"
> & {
  label: string
  iconNameLeft?: string
  iconNameRight?: string
}

export const InputButtonTertiary = forwardRef<HTMLButtonElement, InputButtonTertiaryProps>((p, ref) => {
  const iconName = p.iconNameLeft || p.iconNameRight
  let iconPlacement: InputButtonProps["iconPlacement"] = "beforeLabel"

  if (p.iconNameLeft) {
    iconPlacement = "beforeLabel"
  }

  if (p.iconNameRight) {
    iconPlacement = "afterLabel"
  }

  return (
    <InputButton
      className="<InputButtonTertiary /> -"
      id={p.id}
      ref={ref}
      variant="transparent"
      size={p.size}
      width={p.width}
      colorForeground={[Color.Primary, 700]}
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
      href={p.href}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
