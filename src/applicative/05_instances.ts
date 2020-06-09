import * as A from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import * as T from "fp-ts/lib/Task"
import { liftA2Array } from "src/applicative/03_ap"
import { pipe } from "fp-ts/lib/pipeable"
import fetch from "cross-fetch"
import { identity } from "fp-ts/lib/function"

/*
    Array Applicative Instance
*/
const applicativeArray = {
  map: <A, B>(fa: Array<A>, f: (a: A) => B): Array<B> => fa.map(f),
  of: <A>(a: A): Array<A> => [a],
  ap: <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
    A.flatten(fab.map(f => fa.map(f))),
}

const arr1 = [1, 2, 3, 4, 5]
const ab = (x: number) => x * 10
const fab = applicativeArray.of(ab)

const arrAp = pipe(
  arr1,
  A.map(x => x * 5),
  A.ap,
)

// arrAp(fab) //?

// liftA2
const arr2 = [6, 7, 8, 9, 10]
const f = (x: number) => (y: number) => x * y * 10

// liftA2Array(f, arr1, arr2) //?

/*
    Option Applicative Instance
*/
const applicativeOption = {
  map: <A, B>(fa: O.Option<A>, f: (a: A) => B): O.Option<B> =>
    O.isNone(fa) ? O.none : O.some(f(fa.value)),
  of: <A>(a: A): O.Option<A> => O.some(a),
  ap: <A, B>(fab: O.Option<(a: A) => B>, fa: O.Option<A>): O.Option<B> =>
    O.isNone(fab) ? O.none : applicativeOption.map(fa, fab.value),
}

const opt = O.some("Hello")
const ab1 = (x: string) => `${x} World!`
const fab1 = applicativeOption.of(ab1)

const stringAp = pipe(
  opt,
  O.map(x => `${x} Amazing`),
  O.ap,
)

// stringAp(fab1) //?

/*
    Task Applicative Instance
*/
const applicativeTask = {
  map: <A, B>(fa: T.Task<A>, f: (a: A) => B): T.Task<B> => () => fa().then(f),
  of: <A>(a: A): T.Task<A> => () => Promise.resolve(a),
  ap: <A, B>(fab: T.Task<(a: A) => B>, fa: T.Task<A>): T.Task<B> => () =>
    Promise.all([fab(), fa()]).then(([f, a]) => f(a)),
}

const task: T.Task<{
  message: { [key: string]: Array<string> }
  status: string
}> = () => fetch("https://dog.ceo/api/breeds/list/all").then(res => res.json())
const ab2 = (x: Array<string>) => x.join(", ")
const fab2 = applicativeTask.of(ab2)

const taskAp = pipe(
  task,
  T.map(x =>
    Object.entries(x.message).flatMap(([breed, subbreeds]) =>
      [breed].concat(subbreeds),
    ),
  ),
  T.ap,
)

// taskAp(fab2)().then(identity) //?
