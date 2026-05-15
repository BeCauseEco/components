import { ReactNode } from "react"
import { RenderLeafProps } from "slate-react"

type CustomLeaf = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

type LeafProps = Omit<RenderLeafProps, "leaf"> & { leaf: CustomLeaf }

const wrap = (active: boolean | undefined, Tag: "strong" | "em" | "u" | "code", inner: ReactNode): ReactNode =>
  active ? <Tag>{inner}</Tag> : inner

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  let content: ReactNode = children
  content = wrap(leaf.code, "code", content)
  content = wrap(leaf.italic, "em", content)
  content = wrap(leaf.underline, "u", content)
  content = wrap(leaf.bold, "strong", content)
  return <span {...attributes}>{content}</span>
}

export default Leaf
