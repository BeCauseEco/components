import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonLinkProps = Pick<
  InputButtonProps,
  | "id"
  | "size"
  | "hug"
  | "loading"
  | "disabled"
  | "onClick"
  | "preventDefault"
  | "href"
  | "target"
  | "data-playwright-testid"
  | "tabIndex"
> & {
  label: string
  iconNameLeft?: string
  iconNameRight?: string
}

export const InputButtonLink = forwardRef<HTMLAnchorElement, InputButtonLinkProps>((p, ref) => {
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
      className="<InputButtonLink /> -"
      id={p.id}
      ref={ref}
      variant="link"
      size={p.size}
      width="auto"
      colorForeground={[Color.Quarternary, 700]}
      label={p.label}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      iconName={iconName}
      iconPlacement={iconPlacement}
      onClick={p.onClick}
      preventDefault={p.preventDefault}
      href={p.href}
      target={p.target}
      tabIndex={p.tabIndex}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
