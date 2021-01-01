import * as laws from "fp-ts-laws"
import * as fc from "fast-check"
import * as Eq from "fp-ts/lib/Eq"

import * as FS from "src/validation/lib/FreeSemiring"

const arbitraryFreeSemiring: <A>(
  arb: fc.Arbitrary<A>,
) => fc.Arbitrary<FS.FreeSemiring<A>> = arb =>
  fc.set(fc.array(arb)).map(xs => new Set(xs))

describe("FreeSemiring", () => {
  it("should be a lawful Semiring", () => {
    laws.semiring(
      FS.getSemiring<string>(Eq.eqString),
      FS.getEq(Eq.eqString),
      arbitraryFreeSemiring(fc.string()),
    )
  })
})
