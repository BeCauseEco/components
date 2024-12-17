import React, { ReactNode } from "react"
import { ReactElement } from "react"

type Children = ReactNode | ReactElement | ReactNode[] | ReactElement[]

export type ChildrenValidationResult = {
  valid: boolean
  invalidChildren: string[]
  styles: object
}

const getComponentName = (child: Children): string => child?.["type"]?.["name"] || child?.["type"]

// eslint-disable-next-line
const getComponentTypeNames = (children: Children): string[] => {
  const r: string[] = []

  if (Array.isArray(children)) {
    for (const child of children) {
      if (child?.["type"]?.toString() === "Symbol(react.fragment)") {
        r.push(
          ...getComponentTypeNames(
            React.Children.toArray(child?.["props"]?.["children"]).filter(c => React.isValidElement(c)),
          ),
        )
      } else {
        r.push(getComponentName(child))
      }
    }
  } else {
    r.push(getComponentName(children))
  }

  return r
}

export const validateChildren = (
  // eslint-disable-next-line
  method: "whitelist" | "disallow",
  // eslint-disable-next-line
  allowedTypes: string[],
  // eslint-disable-next-line
  children: Children,
): ChildrenValidationResult => {
  if (process?.env?.NODE_ENV === "development") {
    const validChildren = React.Children.toArray(children)
    const componentTypeNames = getComponentTypeNames(validChildren)

    let invalidChildren: string[] = []

    if (method === "whitelist") {
      invalidChildren = componentTypeNames.filter(
        typeName => ![...allowedTypes, "__SENTRY_WRAPPING_TARGET_FILE__"].includes(typeName),
      )
    } else {
      invalidChildren = componentTypeNames.filter(typeName => allowedTypes.includes(typeName))
    }

    const valid = invalidChildren.length === 0

    return {
      valid,
      invalidChildren,
      styles: valid
        ? {
            "&::before": {},
          }
        : {
            position: "relative",
            outline: "solid 2px red",
            outlineOffset: "-2px",
            backgroundColor: "rgba(255, 0, 0, 0.2)",

            "&::after": {
              content: `"INVALID CHILDREN: ${invalidChildren.join(", ")}"`,
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "red",
              color: "white",
              fontSize: "16px",
              lineHeight: "16px",
              zIndex: 999999999,
              padding: "2px 4px",
            },
          },
    }
  } else {
    return {
      valid: true,
      invalidChildren: [],
      styles: {},
    }
  }
}
