import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonTertiaryProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "href" | "destructive" | "playwrightTestId"
> & {
  label: string
  iconNameLeft?: string
  iconNameRight?: string
}

export const InputButtonTertiary = forwardRef<HTMLButtonElement, InputButtonTertiaryProps>((p, ref) => {
  const iconName = p.iconNameLeft || p.iconNameRight
  let iconPlacement: InputButtonProps["iconPlacement"] = "labelNotSpecified"

  if (p.iconNameLeft) {
    iconPlacement = "beforeLabel"
  }

  if (p.iconNameRight) {
    iconPlacement = "afterLabel"
  }

  return (
    <InputButton
      id={p.id}
      ref={ref}
      variant="transparent"
      size={p.size}
      color={Color.Primary}
      label={p.label}
      hug={p.hug}
      loading={p.loading}
      disabled={p.disabled}
      destructive={p.destructive}
      iconName={iconName}
      iconPlacement={iconPlacement}
      onClick={p.onClick}
      href={p.href}
      playwrightTestId={p.playwrightTestId}
    />
  )
})
