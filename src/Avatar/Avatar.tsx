import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"

export type AvatarProps = PlaywrightProps & {
  size: "small" | "large"
  title: string
  src: string
}

const computeSize = (size: AvatarProps["size"]) => {
  switch (size) {
    case "small":
      return "calc(var(--BU) * 4)"
    case "large":
      return "calc(var(--BU) * 8)"
  }
}

const Image = styled.div<Pick<AvatarProps, "size" | "src">>(p => ({
  display: "inline-flex",
  width: computeSize(p.size),
  height: computeSize(p.size),
  flexShrink: 0,
  backgroundImage: `url("${p.src}")`,
  backgroundSize: "cover",
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
}))

export const Avatar = (p: AvatarProps) => <Image size={p.size} src={p.src} title={p.title} />
