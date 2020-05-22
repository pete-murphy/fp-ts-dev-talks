import { map, empty } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"

console.log(
  pipe(
    [4],
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    empty,
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    ["foo"],
    map(n => `${n}bar`),
  ),
)

// Exercise: Why doesn't this work?

// console.log(
//   pipe(
//     [[1]],
//     map(n => n * 2),
//   ),
// )
