import { forwardRef } from "react"
import { InputButtonProps, InputButton } from "@new/InputButton/internal/InputButton"
import { Color } from "@new/Color"

export type InputButtonIconTertiaryProps = Pick<
  InputButtonProps,
  "id" | "size" | "hug" | "loading" | "disabled" | "onClick" | "destructive" | "playwrightTestId"
> & {
  iconName: string
}

export const InputButtonIconTertiary = forwardRef<HTMLButtonElement, InputButtonIconTertiaryProps>((p, ref) => {
  return (
    <InputButton
      className="<InputButtonIconTertiary /> -"
      id={p.id}
      ref={ref}
      variant="transparent"
      size={p.size}
      width="auto"
      colorForeground={[Color.Primary, 700]}
      colorBackgroundHover={[Color.Primary, 100]}
      colorLoading={[Color.Primary, 700]}
      hug={p.hug}
      loading={p.loading ? true : undefined}
      disabled={p.disabled ? true : undefined}
      destructive={p.destructive}
      iconName={p.iconName}
      iconPlacement="labelNotSpecified"
      onClick={p.onClick}
      playwrightTestId={p.playwrightTestId}
    />
  )
})
