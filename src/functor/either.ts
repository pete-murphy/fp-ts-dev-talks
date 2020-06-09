import { left, right, map, fromNullable, mapLeft } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"

console.log(
  pipe(
    right(4),
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    left(3),
    map(n => n * 2),
  ),
)

console.log(
  pipe(
    left(3),
    mapLeft(n => n * 2),
  ),
)

console.log(
  pipe(
    fromNullable("foo")("baz"),
    map(n => `${n}bar`),
  ),
)

console.log(
  pipe(
    fromNullable("foo")(null),
    map(n => `${n}bar`),
  ),
)

console.log(
  pipe(
    fromNullable("foo")(null),
    mapLeft(n => `${n}bar`),
  ),
)

// Exercise: Why doesn't this work?

// console.log(
//   pipe(
//     right(right(1)),
//     map(n => n * 2),
//   ),
// )
