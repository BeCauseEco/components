import { ComponentProps, Ref } from "react"
import { ToolbarContainer } from "../RichTextEditor.styles"

type ToolbarProps = ComponentProps<"div"> & {
  ref?: Ref<HTMLDivElement>
}

export const Toolbar = ({ className, ref, children, ...props }: ToolbarProps) => (
  <ToolbarContainer {...props} ref={ref} className={className}>
    {children}
  </ToolbarContainer>
)
