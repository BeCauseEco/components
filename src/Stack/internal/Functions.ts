import { AlignProps } from "../Align"
import { StackProps } from "../Stack"

export const computeAlignment = (p: Omit<AlignProps, "spacing" | "hug">) => {
  const r = {
    justifyContent: "",
    alignItems: "",
    alignSelf: "",
    justifySelf: "",
  }

  if (p["vertical"]) {
    if (p["topLeft"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p["topCenter"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["topRight"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p["left"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-start"
      r.alignItems = "flex-start"
    }

    if (p["center"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["right"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p["bottomLeft"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p["bottomCenter"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["bottomRight"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }
  } else if (p["horizontal"]) {
    if (p["topLeft"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p["topCenter"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p["topRight"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-start"
      r.alignSelf = "flex-start"
    }

    if (p["left"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["center"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["right"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "center"
      r.alignSelf = "center"
    }

    if (p["bottomLeft"]) {
      r.justifyContent = "flex-start"
      r.justifySelf = "flex-start"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p["bottomCenter"]) {
      r.justifyContent = "center"
      r.justifySelf = "center"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }

    if (p["bottomRight"]) {
      r.justifyContent = "flex-end"
      r.justifySelf = "flex-end"
      r.alignItems = "flex-end"
      r.alignSelf = "flex-end"
    }
  }

  return r
}

export const computeWidthHeight = (p: AlignProps) => {
  let w = "100%"
  let h = "100%"

  if (p.hug === true) {
    w = "min-content"
    h = "min-content"
  } else if (p.hug === "width") {
    w = "min-content"
  } else if (p.hug === "height") {
    h = "min-content"
  }

  return { width: w, height: h }
}

export const translateBorderRadius = (cornerRadius: StackProps["cornerRadius"]): string => {
  switch (cornerRadius) {
    case "small":
      return "calc(var(--BU) / 2)"

    case "medium":
      return "calc(var(--BU) * 1)"

    case "large":
      return "calc(var(--BU) * 2)"

    default:
      return "0"
  }
}
