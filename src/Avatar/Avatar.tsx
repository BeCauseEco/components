import styled from "@emotion/styled"
import { PlaywrightProps } from "@new/Playwright"

export type AvatarProps = PlaywrightProps & {
  title: string
  src: string
}

const Image = styled.div<{ src: string }>(p => ({
  display: "flex",
  width: "calc(var(--BU) * 8)",
  height: "calc(var(--BU) * 8)",
  flexShrink: 0,
  backgroundImage: `url("${p.src}")`,
  backgroundSize: "cover",
}))

export const Avatar = (p: AvatarProps) => <Image src={p.src} title={p.title} />
