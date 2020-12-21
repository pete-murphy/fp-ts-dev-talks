import { Applicative1, getApplicativeComposition } from "fp-ts/lib/Applicative"
import { pipe } from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { Semiring } from "fp-ts/lib/Semiring"

export type FreeSemiring<A> = ReadonlyArray<ReadonlyArray<A>>

export const URI = "FreeSemiring"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    FreeSemiring: FreeSemiring<A>
  }
}

export const getSemiring = <A>(): Semiring<FreeSemiring<A>> => ({
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

export const freeSemiring: Applicative1<URI> = {
  URI,
  ...getApplicativeComposition(RA.Applicative, RA.Applicative),
}
