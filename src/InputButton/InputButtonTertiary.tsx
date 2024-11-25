import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonTertiaryProps = Pick<
  InputButtonProps,
  "id" | "size" | "width" | "hug" | "loading" | "disabled" | "onClick" | "href" | "destructive" | "playwrightTestId"
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
      width={p.width}
      colorForeground={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 100]}
      colorLoading={[Color.Primary, 700]}
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
