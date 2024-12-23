import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconLinkProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "data-playwright-testid"
> & {
  iconName: string
  href: InputButtonProps["href"]
}

export const InputButtonIconLink = forwardRef<HTMLButtonElement, InputButtonIconLinkProps>((p, ref) => {
  return (
    <InputButton
      className="<InputButtonIconLink /> -"
      id={p.id}
      ref={ref}
      variant="link"
      size={p.size}
      width="auto"
      colorForeground={[Color.Quarternary, 700]}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      onClick={p.onClick}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
