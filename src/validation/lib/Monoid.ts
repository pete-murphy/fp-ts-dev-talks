import { Monoid } from "fp-ts/lib/Monoid"
import { createElement, Fragment, ReactNode } from "react"

export const monoidJSX: Monoid<ReactNode> = {
  concat: (x, y) => createElement(Fragment, { children: [x, y] }),
  empty: Fragment,
}
