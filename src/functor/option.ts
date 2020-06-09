import { some, none, map, fromNullable } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

console.log(
  pipe(
    some(4),
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    none,
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    fromNullable("foo"),
    map(n => `${n}bar`),
  ),
)

console.log(
  pipe(
    fromNullable(null),
    map(n => `${n}bar`),
  ),
)

// Exercise: Why doesn't this work?

// console.log(
//   pipe(
//     some(some(1)),
//     map(n => n * 2),
//   ),
// )
