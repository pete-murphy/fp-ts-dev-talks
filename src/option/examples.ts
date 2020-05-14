import {
  fromNullable,
  Option,
  some,
  none,
  map,
  getOrElse,
  toUndefined,
  fold,
} from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

// helper function for presentation
const output = (label: string, value: any) =>
  `<div>${label}: <pre>${JSON.stringify(value)}</pre></div>`
// an Option wraps a value. The value can be anything -
// number, string, object, etc.

type UserAsOption = Option<{
  age: number
}>

// some() is a function that wraps a value in an Option.
const userAsOption = some({ age: 23 })
const output1 = output("userAsOption", userAsOption)
// map performs an operation on the value inside an Option,
// and places the result inside a new Option
const ageOption = pipe(
  userAsOption,
  map(user => user.age),
)
const output2 = output("ageOption", ageOption)

// the value inside an Option is _not_ the same as the value
// note how typescript complains about the right hand side
const compare = ageOption === 23
const output3 = output("compare", compare)

// one use case for an Option is to represent a value that might not exist.
// some() as we have seen does have a value in it.
// the constant `none`  represents the situation of no value
const output4 = output("none", none)

const output5 = output("is none same as some(null)", none === some(null))
const output6 = output("some(null)", some(null))
// which is different from having an Option wrapping a value like null

/* to be more precise, here is now Option is defined in terms of
None and Some
export interface None {
  readonly _tag: 'None'
}
export interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

export type Option<A> = None | Some<A>

export const none: Option<never> = { _tag: 'None' }

export function some<A>(a: A): Option<A> {
  return { _tag: 'Some', value: a }
}
*/

// getting value out
// getOrElse(arg) returns the value in an Option if there is one,
// or the argument _arg_ if there is no value
const output7 = output(
  `pipe(
    some("a value"),
    getOrElse(() => "default value"),
  )`,
  pipe(
    some("a value"),
    getOrElse(() => "default value"),
  ),
)
const noneForString: Option<string> = none
const output8 = output(
  `  pipe(
    noneForString,
    getOrElse(() => "default value"),
  )`,
  pipe(
    noneForString,
    getOrElse(() => "default value"),
  ),
)
// sometimes the desired 'default' is _undefined_ .
// there is a separate method for that
const output9 = output(
  "pipe(ageOption, toUndefined",
  pipe(ageOption, toUndefined),
)
const output10 = output("pipe(none, toUndefined)", pipe(none, toUndefined))

// the fromNullable function can be used to turn a null into a none,
// and any value into a Some of that value
const output11 = output("fromNullable(null)", fromNullable(null))
const output12 = output(
  'fromNullable("a non-null value")',
  fromNullable("a non-null value"),
)

// foldL is a method on Option that takes two callback functions
// the first will be executed if the Option is a None, the second if
// the Option is a Some

const foldOverNone = pipe(
  none,
  fold(
    () => "this appears if the receiver of foldL is a none",
    value =>
      `if the receiver of foldL is a value it appears here: ${JSON.stringify(
        value,
      )}`,
  ),
)
const output13 = output("foldOverNone", foldOverNone)

const foldOverObject = pipe(
  some({ foo: "bar" }),
  fold(
    () => "this appears if the receiver of foldL is a none",
    value =>
      `if the receiver of foldL is a value it appears here: ${JSON.stringify(
        value,
      )}`,
  ),
)
const output14 = output("foldOverObject", foldOverObject)

pipe(
  fromNullable(document.getElementById("app")),
  fold(
    () => null,
    elem =>
      (elem.innerHTML = `
    <h1>Notes on Option</h1>
    <h2>from fp-ts</h2>
    ${output1}
    ${output2}
    ${output3}
    ${output4}
    ${output5}
    ${output6}
    ${output7}
    ${output8}
    ${output9}
    ${output10}
    ${output11}
    ${output12}
    ${output13}
    ${output14}
    `),
  ),
)
