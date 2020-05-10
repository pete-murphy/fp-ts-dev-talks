import {
  left,
  right,
  fromNullable,
  tryCatch,
  fold,
  mapLeft,
  map,
  either,
  getWitherable,
  bimap,
} from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import { monoidString } from "fp-ts/lib/Monoid"

const eitherLeft = left("this is an error")

const eitherRight = right("this is a success")

const eitherEx1 = fromNullable("default")

eitherEx1(null) //?
left("default") //?

const success = eitherEx1(1)
// success

pipe(
  eitherEx1(null),
  map(n => n + 1),
  fold(
    x => x.length,
    n => n * 10,
  ),
) //?

const failure = eitherEx1(null)

const eitherEx2 = tryCatch(
  () => {
    throw Error("this is an error")
  },
  err => (err instanceof Error ? err : new Error("unknown error")),
)

tryCatch<string, number>(
  () => {
    throw Error("wat")
  },
  e => "hello",
) //?

const ex2a = pipe(
  eitherEx2,
  fold(
    err => `error occured: ${err.message}`,
    num => `result is ${num}`,
  ),
) //?

const ex2b = pipe(
  eitherEx2,
  map(num => num * 12030110),
  mapLeft(_ => new Error("modifying the error before getting it")),
  fold(
    err => `error occured: ${err.message}`,
    num => `result is ${num}`,
  ),
) //?

const eitherEx3 = tryCatch(
  () => 1,
  err => (err instanceof Error ? err : new Error("unknown error")),
)

console.log(
  pipe(
    eitherEx3,
    fold(
      err => `error occured: ${err.message}`,
      num => `result is ${num}`,
    ),
  ),
)

console.log(
  pipe(
    eitherEx3,
    map(num => num * 10),
    mapLeft(_ => new Error("modifying the error before getting it")),
    fold(
      err => `error occured: ${err.message}`,
      num => `result is ${num}`,
    ),
  ),
)
