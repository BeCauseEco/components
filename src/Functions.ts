import React from "react"
import { ReactElement } from "react"

export const containsIlligalChildren = (
  children: ReactElement | ReactElement[] | null,
  allowedTypes: string[],
): boolean => {
  const typeNames = React.Children.toArray(children).flatMap(a => a["type"]["name"])
  const types = React.Children.toArray(children).flatMap(a => a["type"]?.toString())

  types.forEach(type => {
    console.log(1, type)
  })

  console.log("containsIlligalChildren", typeNames, types, allowedTypes)

  return false
}
