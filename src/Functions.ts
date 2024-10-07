import React from "react"
import { ReactElement } from "react"

export const containsIlligalChildren = (children: ReactElement | ReactElement[], allowedTypes: string[]): boolean => {
  const a = React.Children.toArray(children).flatMap(a => a["type"]["name"])
  const b = allowedTypes

  console.log(
    a,
    b,
    a.some(v => b.includes(v)),
  )

  // return a.some(r => allowedTypes.includes(r))

  // console.log(11, types, allowedTypes)

  return false
}
