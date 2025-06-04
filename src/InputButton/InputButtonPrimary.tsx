import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonPrimaryProps = Pick<
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
  iconNameLeft?: string
  iconNameRight?: string
}

export const InputButtonPrimary = forwardRef<HTMLButtonElement, InputButtonPrimaryProps>((p, ref) => {
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
      className="<InputButtonPrimary /> -"
      id={p.id}
      ref={ref}
      variant="solid"
      size={p.size}
      width={p.width}
      colorForeground={[Color.Primary, 50]}
      colorBackground={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 800]}
      colorLoading={[Color.Primary, 50]}
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
