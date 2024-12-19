import React, { ReactNode } from "react"
import { ReactElement } from "react"

type Children = ReactNode | ReactElement | ReactNode[] | ReactElement[]

export type ChildrenValidationResult = {
  valid: boolean
  invalidChildren: string[]
  stylesError: object
}

const getComponentName = (child: Children): string => {
  // console.log("getComponentName", child)
  // console.log("getComponentName1", child?.["type"]?.["name"])
  // console.log("getComponentName2", child?.["type"], typeof child?.["type"])
  // console.log("getComponentName3", typeof child?.["type"])
  // console.log("---")

  const a = child?.["type"]?.["name"]
  const b = child?.["type"]

  // console.log("getComponentName", child, b)

  return a || b
}

// eslint-disable-next-line
const getComponentTypeNames = (children: Children): string[] => {
  const r: string[] = []

  if (Array.isArray(children)) {
    for (const child of children) {
      // console.log("child1", child)
      // console.log("child2", child?.["type"]?.toString())
      // console.log("child3", child?.["$$typeof"])
      // console.log("---")

      // console.log("child1", child)
      // console.log("---")

      if (child?.["type"]?.toString() === "Symbol(react.fragment)") {
        r.push(
          ...getComponentTypeNames(
            React.Children.toArray(child?.["props"]?.["children"]).filter(c => React.isValidElement(c)),
          ),
        )
      } else {
        const n = getComponentName(child)

        console.log("childB", child)
        console.log("childB", child?.["$$typeof"])
        console.log("childB", child?.["type"]?.["name"])
        console.log("childB", child?.["type"])
        console.log("childB", n)
        console.log("---")

        if (n) {
          r.push(n)
        }
      }
    }
  } else {
    const n = getComponentName(children)

    console.log("childA", children)
    console.log("childA", n)
    console.log("---")

    if (n) {
      r.push(n)
    }
  }

  console.log("...", r)

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
      invalidChildren = componentTypeNames.filter(typeName => {
        // console.log("typeName", typeName, allowedTypes, allowedTypes.includes(typeName))

        return allowedTypes.includes(typeName)
      })
    }

    // console.log("invaliid", allowedTypes, invalidChildren)

    const valid = invalidChildren.length === 0

    return {
      valid,
      invalidChildren,
      stylesError: {
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
      stylesError: {},
    }
  }
}
