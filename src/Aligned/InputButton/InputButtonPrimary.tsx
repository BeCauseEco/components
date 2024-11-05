import { forwardRef } from "react"
import { TInputButton, InputButton } from "@new/Aligned/InputButton/internal/InputButton"
import { EColor } from "@new/Color"

type TInputButtonPrimaryBase = Pick<TInputButton, "size" | "hug" | "loading" | "disabled"> & {
  label: string
}

type TInputButtonPrimary =
  | (TInputButtonPrimaryBase & {
      iconLeftName?: string
    })
  | (TInputButtonPrimaryBase & {
      iconRightName?: string
    })

export const InputButtonPrimary = forwardRef<HTMLButtonElement | HTMLAnchorElement, TInputButtonPrimary>((p, ref) => (
  <InputButton
    ref={ref}
    variant="solid"
    size={p.size}
    color={EColor.Primary}
    label={p.label}
    hug={p.hug}
    loading={p.loading}
    disabled={p.disabled}
  />
))
