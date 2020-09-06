import { identity } from "fp-ts/lib/function"
import { Monoid } from "fp-ts/lib/Monoid"
import React, {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  ReactNode,
  useState,
} from "react"

type Props = {
  children: ReactElement | Array<ReactElement>
}

export const HighlightSearch = (props: Props) => {
  const [searchText, setSearchText] = useState("fo")
  return (
    <section>
      <input onChange={e => setSearchText(e.target.value)} value={searchText} />
      {Array.isArray(props.children)
        ? props.children.map(highlightMap(searchText))
        : highlightMap(searchText)(props.children)}
    </section>
  )
}

const mapReactElementTree = (f: (str: string) => ReactNode) => (
  el: ReactElement | string,
): ReactNode =>
  typeof el === "string"
    ? f(el)
    : !el.props?.hasOwnProperty("children")
    ? el
    : cloneElement(
        el,
        el.props,
        React.Children.map(el.props.children, mapReactElementTree(f)),
      )
const mapMatches = (searchRE: RegExp, mapMatch: (str: string) => ReactNode) => (
  str: string,
) => {
  const acc: Array<ReactNode> = []
  let str_: string = str
  let match: RegExpExecArray | null
  while ((match = searchRE.exec(str)) !== null) {
    const start = match.index
    const end = searchRE.lastIndex
    acc.push(str_.slice(0, start))
    acc.push(mapMatch(str_.slice(start, end)))
    str_ = str_.slice(end)
  }
  acc.push(str_)
  return acc
}

export const highlightMap = (searchText: string) =>
  searchText === ""
    ? identity
    : mapReactElementTree(
        mapMatches(RegExp(searchText, "gi"), match => <mark>{match}</mark>),
      )

export const monoidJsx: Monoid<ReactNode> = {
  concat: (x, y) => createElement(Fragment, { children: [x, y] }),
  empty: Fragment,
}
