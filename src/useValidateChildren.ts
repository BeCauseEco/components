import { CSSObject } from "@emotion/react"
import React, { ReactNode, useEffect, useState } from "react"
import { ReactElement } from "react"

type Children = ReactNode | ReactElement | ReactNode[] | ReactElement[]

type InvalidChildren = string[]

export type ValidateChildrenErrorStyles = CSSObject

export const generateErrorStyles = (invalidChildren: InvalidChildren): ValidateChildrenErrorStyles =>
  invalidChildren.length
    ? {
        position: "relative",
        background: `repeating-linear-gradient(
          -45deg,
          rgba(255, 0, 0, 0.2),
          rgba(255, 0, 0, 0.2) 3px,
          rgba(255, 0, 0, 0.1) 3px,
          rgba(255, 0, 0, 0.1) 6px
        )`,

        "&::before": {
          content: `"INVALID CHILDREN: ${invalidChildren.join(", ")}"`,
          position: "absolute",
          top: "calc(100% - 16px)",
          right: 0,
          color: "rgba(255, 255, 255, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          fontSize: "16px",
          lineHeight: "16px",
          zIndex: 999999999,
        },
      }
    : {}

export const generateErrorClassName = (invalidChildren: InvalidChildren): string =>
  invalidChildren.length ? ` *** INVALID CHILDREN: ${invalidChildren.join(", ")} ***` : ""

const getComponentName = (parentTypeName: string, child: Children): string | undefined => {
  const isReactElement = child?.["$$typeof"]?.toString() === "Symbol(react.element)"
  const typeName = child?.["type"]?.["name"]
  const type = child?.["type"]
  const typeIsObject = typeof child?.["type"] === "object"
  const typeIsFunction = child?.["type"]?.toString().includes("=>")
  const emotionBase = child?.["type"]?.["__emotion_base"]
  const emotionBaseIsComponent = typeof child?.["type"]?.["__emotion_base"] === "object"

  if (isReactElement) {
    if (emotionBaseIsComponent) {
      // eslint-disable-next-line no-console
      // console.groupCollapsed(
      //   `⚠️ <${parentTypeName} /> contains a Styled(Component) See https://github.com/BeCauseEco/ui?tab=readme-ov-file#overriding-styles for more information.`,
      // )
      // // eslint-disable-next-line no-console
      // console.trace()
      // // eslint-disable-next-line no-console
      // console.groupEnd()
    } else if (!emotionBaseIsComponent && emotionBase !== undefined) {
      return emotionBase
    } else {
      if (!typeIsFunction && !typeIsObject) {
        return type
      } else if (typeName !== undefined) {
        return typeName
      }
    }
  }

  return undefined
}

const getComponentTypeNames = (parentTypeName, children: Children): string[] => {
  const r: string[] = []
  const c = Array.isArray(children) ? children : [children]

  for (const child of c) {
    const isReactFragment = child?.["type"]?.toString() === "Symbol(react.fragment)"

    if (isReactFragment) {
      r.push(...getComponentTypeNames(parentTypeName, React.Children.toArray(child?.["props"]?.["children"])))
    } else {
      const n = getComponentName(parentTypeName, child)

      if (n) {
        r.push(n)
      }
    }
  }

  return r
}

export const useValidateChildren = (
  parentTypeName: string,
  allowedTypeNames: string[],
  disallowedTypeNames: string[],
  children: Children,
): [InvalidChildren] => {
  const [state, setState] = useState<InvalidChildren>([])

  useEffect(() => {
    if (process?.env?.NODE_ENV === "development") {
      const componentTypeNames = getComponentTypeNames(parentTypeName, React.Children.toArray(children))

      const invalidChildren: string[] = []

      if (allowedTypeNames.length) {
        invalidChildren.push(...componentTypeNames.filter(typeName => !allowedTypeNames.includes(typeName)))
      }

      if (disallowedTypeNames.length) {
        invalidChildren.push(...componentTypeNames.filter(typeName => disallowedTypeNames.includes(typeName)))
      }

      if (invalidChildren.length > 0) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(`⚠️ <${parentTypeName} /> contains invalid children: [${invalidChildren.join(", ")}]`)
        // eslint-disable-next-line no-console
        console.trace()
        // eslint-disable-next-line no-console
        console.groupEnd()
      }

      setState(invalidChildren)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return [state]
}
