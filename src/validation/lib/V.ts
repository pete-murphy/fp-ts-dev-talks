import { Apply2 } from "fp-ts/lib/Apply"
import { Predicate, Refinement, pipe } from "fp-ts/lib/function"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"

// -------------------------------------------------------------------------------------
// Model
// -------------------------------------------------------------------------------------

export interface Bad<E> {
  readonly _tag: "Bad"
  readonly bad: RNEA.ReadonlyNonEmptyArray<E>
}

export interface Ok<A> {
  readonly _tag: "Ok"
  readonly ok: A
}

export type V<E, A> = Bad<E> | Ok<A>

export const URI = "V"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: V<E, A>
  }
}

// -------------------------------------------------------------------------------------
// Instances
// -------------------------------------------------------------------------------------

export const v: Apply2<URI> = {
  URI,
  map: (fa, f) => pipe(fa, map(f)),
  ap: (fab, fa) => pipe(fab, ap(fa)),
}

export const map: <A, B>(
  f: (a: A) => B,
) => <E>(fa: V<E, A>) => V<E, B> = f => fa => (isBad(fa) ? fa : ok(f(fa.ok)))

export const ap: <X, A>(
  fa: V<X, A>,
) => <B>(fab: V<X, (a: A) => B>) => V<X, B> = fa => fab =>
  isBad(fab) && isBad(fa)
    ? bad(RNEA.concat(fab.bad, fa.bad))
    : isBad(fab)
    ? fab
    : isBad(fa)
    ? fa
    : ok(fab.ok(fa.ok))

// -------------------------------------------------------------------------------------
// Guards
// -------------------------------------------------------------------------------------

export const isBad = <E, A>(ma: V<E, A>): ma is Bad<E> => ma._tag === "Bad"
export const isOk = <E, A>(ma: V<E, A>): ma is Ok<A> => ma._tag === "Ok"

// -------------------------------------------------------------------------------------
// Constructors
// -------------------------------------------------------------------------------------

export const bad = <E = never, A = never>(
  e: RNEA.ReadonlyNonEmptyArray<E>,
): V<E, A> => ({
  _tag: "Bad",
  bad: e,
})
export const ok = <E = never, A = never>(a: A): V<E, A> => ({
  _tag: "Ok",
  ok: a,
})
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    a: A,
  ) => V<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => V<E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => (a: A) =>
  predicate(a) ? ok(a) : bad([onFalse(a)])

// -------------------------------------------------------------------------------------
// Destructors
// -------------------------------------------------------------------------------------

export function fold<E, A, B>(
  onBad: (e: RNEA.ReadonlyNonEmptyArray<E>) => B,
  onOk: (a: A) => B,
): (ma: V<E, A>) => B {
  return ma => (isBad(ma) ? onBad(ma.bad) : onOk(ma.ok))
}
