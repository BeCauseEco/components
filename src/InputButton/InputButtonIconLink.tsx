import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconLinkProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "playwrightTestId"
> & {
  iconName: string
  href: InputButtonProps["href"]
}

export const InputButtonIconLink = forwardRef<HTMLButtonElement, InputButtonIconLinkProps>((p, ref) => {
  return (
    <InputButton
      id={p.id}
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
      playwrightTestId={p.playwrightTestId}
    />
  )
})
