import { Color, ColorWithLightness } from "@new/Color"
import { Text } from "@new/Text/Text"
import * as RadixToast from "@radix-ui/react-toast"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { Spacer } from "@new/Stack/Spacer"
import { Align } from "@new/Stack/Align"
import { Icon } from "@new/Icon/Icon"
import { InputButtonIconTertiary } from "@new/InputButton/InputButtonIconTertiary"

const hide = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
})

const slideIn = keyframes({
  from: {
    transform: "translateX(calc(100% + var(--viewport-padding)))",
  },
  to: {
    transform: "translateX(0)",
  },
})

const swipeOut = keyframes({
  from: {
    transform: "translateX(var(--radix-toast-swipe-end-x))",
  },
  to: {
    transform: "translateX(calc(100% + var(--viewport-padding)))",
  },
})

const ToastRoot = styled(RadixToast.Root)({
  backgroundColor: Color.White,
  borderRadius: "4px",
  boxShadow: `
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px
  `,
  padding: "10px 24px",

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} 100ms ease-in`,
  },
  '&[data-swipe="move"]': {
    transform: "translateX(var(--radix-toast-swipe-move-x))",
  },
  '&[data-swipe="cancel"]': {
    transform: "translateX(0)",
    transition: "transform 200ms ease-out",
  },
  '&[data-swipe="end"]': {
    animation: `${swipeOut} 100ms ease-out`,
  },
})

type ToastProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
  title: string
  description: string
  severity: "info" | "success" | "warning" | "error"
}

export const Toast = ({ open, onOpenChange, severity, title, description }: ToastProps) => {
  const colorWithLightness = getColorWithLightnessBySeverity(severity)

  return (
    <ToastRoot open={open} onOpenChange={onOpenChange} duration={severity === "error" ? 7000 : 5000}>
      <Align horizontal center>
        <Icon name={getIconNameBySeverity(severity)} fill={colorWithLightness} large />

        <Spacer small />

        <Align vertical>
          <RadixToast.Title asChild>
            <Text fill={colorWithLightness} small>
              <b>{title}</b>
            </Text>
          </RadixToast.Title>

          <Spacer xsmall />

          <RadixToast.Description asChild>
            <Text fill={colorWithLightness} xsmall wrap>
              {description}
            </Text>
          </RadixToast.Description>
        </Align>

        <Spacer small />

        <RadixToast.Close asChild>
          <InputButtonIconTertiary size="large" iconName="close" />
        </RadixToast.Close>
      </Align>
    </ToastRoot>
  )
}

const getColorWithLightnessBySeverity = (severity: ToastProps["severity"]): ColorWithLightness => {
  switch (severity) {
    case "info":
      return [Color.Neutral, 500]
    case "success":
      return [Color.Success, 800]
    case "warning":
      return [Color.Warning, 800]
    case "error":
      return [Color.Error, 800]
    default:
      return [Color.Neutral, 700]
  }
}

const getIconNameBySeverity = (severity: ToastProps["severity"]) => {
  switch (severity) {
    case "info":
      return "info"
    case "success":
      return "check_circle"
    case "warning":
      return "warning"
    case "error":
      return "dangerous"
    default:
      return "info"
  }
}
