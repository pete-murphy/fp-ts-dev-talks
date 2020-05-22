import { map, never, of } from "fp-ts/lib/Task"
import { pipe } from "fp-ts/lib/pipeable"

const result = pipe(
  of(4),
  map(n => n * 2),
)

result().then(a => console.log(`result 1 = ${a}`))

const result2 = pipe(
  never,
  map(n => n * 2),
)

result2().then(a => console.log(`result 2 = ${a}`))

const result3 = pipe(
  of("foo"),
  map(n => `${n}bar`),
)

result3().then(a => console.log(`result 3 = ${a}`))

// Exercise: Why doesn't this work?

// console.log(
//   pipe(
//     of(of(1)),
//     map(n => n * 2),
//   ),
// )
