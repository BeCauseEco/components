import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonSecondaryProps = Pick<InputButtonProps, "size" | "hug" | "loading" | "disabled" | "onClick"> & {
  label: string
  iconLeftName?: string
  iconRightName?: string
}

export const InputButtonSecondary = forwardRef<HTMLButtonElement, InputButtonSecondaryProps>((p, ref) => {
  const iconName = p.iconLeftName || p.iconRightName
  let iconPlacement: InputButtonProps["iconPlacement"] = "labelNotSpecified"

  if (p.iconLeftName) {
    iconPlacement = "beforeLabel"
  }

  if (p.iconRightName) {
    iconPlacement = "afterLabel"
  }

  return (
    <InputButton
      ref={ref}
      variant="outlined"
      size={p.size}
      color={Color.Primary}
      label={p.label}
      hug={p.hug}
      loading={p.loading}
      disabled={p.disabled}
      iconName={iconName}
      iconPlacement={iconPlacement}
      onClick={p.onClick}
    />
  )
})
