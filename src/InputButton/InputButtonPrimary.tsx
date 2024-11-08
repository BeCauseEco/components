import { forwardRef } from "react"
import { TInputButton, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type TInputButtonPrimary = Pick<TInputButton, "size" | "hug" | "loading" | "disabled" | "onClick"> & {
  label: string
  iconLeftName?: string
  iconRightName?: string
}

export const InputButtonPrimary = forwardRef<HTMLButtonElement | HTMLAnchorElement, TInputButtonPrimary>((p, ref) => {
  const iconName = p.iconLeftName || p.iconRightName
  let iconPlacement: TInputButton["iconPlacement"] = "labelNotSpecified"

  if (p.iconLeftName) {
    iconPlacement = "beforeLabel"
  }

  if (p.iconRightName) {
    iconPlacement = "afterLabel"
  }

  return (
    <InputButton
      ref={ref}
      variant="solid"
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
