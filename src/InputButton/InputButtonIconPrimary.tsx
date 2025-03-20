import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconPrimaryProps = Pick<
  InputButtonProps,
  | "id"
  | "size"
  | "hug"
  | "loading"
  | "disabled"
  | "onClick"
  | "preventDefault"
  | "destructive"
  | "data-playwright-testid"
  | "title"
> & {
  iconName: string
}

export const InputButtonIconPrimary = forwardRef<HTMLButtonElement, InputButtonIconPrimaryProps>((p, ref) => {
  return (
    <InputButton
      className="<InputButtonIconPrimary /> -"
      id={p.id}
      ref={ref}
      variant="solid"
      size={p.size}
      width="auto"
      colorForeground={[Color.Primary, 50]}
      colorBackground={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 800]}
      colorLoading={[Color.Primary, 50]}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      destructive={p.destructive}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      title={p.title}
      onClick={p.onClick}
      preventDefault={p.preventDefault}
      data-playwright-testid={p["data-playwright-testid"]}
    />
  )
})
