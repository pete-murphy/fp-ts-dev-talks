import { Applicative1, getApplicativeComposition } from "fp-ts/lib/Applicative"
import { pipe } from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as Sr from "fp-ts/lib/Semiring"
import * as Eq from "fp-ts/lib/Eq"

export type FreeSemiring<A> = ReadonlyArray<ReadonlyArray<A>>

export const URI = "FreeSemiring"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    FreeSemiring: FreeSemiring<A>
  }
}

export const getSemiring = <A>(): Sr.Semiring<FreeSemiring<A>> => ({
  add: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    RA.getMonoid<ReadonlyArray<A>>().concat(xss, yss),
  mul: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    pipe(
      xss,
      RA.chain(xs =>
        pipe(
          yss,
          RA.map(ys => RA.getMonoid<A>().concat(xs, ys)),
        ),
      ),
    ),
  zero: [],
  one: [[]],
})

export const getEq = <A>(eqA: Eq.Eq<A>): Eq.Eq<FreeSemiring<A>> =>
  RA.getEq(RA.getEq(eqA))

export const Applicative: Applicative1<URI> = {
  URI,
  ...getApplicativeComposition(RA.Applicative, RA.Applicative),
}
