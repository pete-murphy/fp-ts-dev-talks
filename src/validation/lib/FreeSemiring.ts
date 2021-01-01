import { flow, pipe } from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RS from "fp-ts/lib/ReadonlySet"
import * as Sr from "fp-ts/lib/Semiring"
import * as Eq from "fp-ts/lib/Eq"

export type FreeSemiring<A> = ReadonlySet<ReadonlyArray<A>>

export const URI = "FreeSemiring"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    FreeSemiring: FreeSemiring<A>
  }
}

export const getSemiring = <A>(
  eqA: Eq.Eq<A>,
): Sr.Semiring<FreeSemiring<A>> => ({
  add: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    RS.getUnionMonoid<ReadonlyArray<A>>(RA.getEq(eqA)).concat(xss, yss),
  mul: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    pipe(
      xss,
      RS.chain(RA.getEq(eqA))(xs =>
        pipe(
          yss,
          RS.map(RA.getEq(eqA))(ys => RA.getMonoid<A>().concat(xs, ys)),
        ),
      ),
    ),
  zero: RS.empty,
  one: RS.singleton([]),
})

export const getEq = <A>(eqA: Eq.Eq<A>): Eq.Eq<FreeSemiring<A>> =>
  RS.getEq(RA.getEq(eqA))

export const free: <A>(a: A) => FreeSemiring<A> = flow(RA.of, RS.singleton)
