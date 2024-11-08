import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconProps = Pick<InputButtonProps, "size" | "hug" | "loading" | "disabled" | "onClick"> & {
  iconName: string
}

export const InputButtonLink = forwardRef<HTMLButtonElement, InputButtonIconProps>((p, ref) => {
  return (
    <InputButton
      ref={ref}
      variant="link"
      size={p.size}
      color={Color.Primary}
      hug={p.hug}
      loading={p.loading}
      disabled={p.disabled}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      onClick={p.onClick}
    />
  )
})
