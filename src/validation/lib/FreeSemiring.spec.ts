import * as laws from "fp-ts-laws"
import * as fc from "fast-check"
import * as Eq from "fp-ts/lib/Eq"

import * as FS from "src/validation/lib/FreeSemiring"

// @TODO - Pete Murphy 2020-12-22 - Currently failing
describe("FreeSemiring", () => {
  it("should be a lawful Semiring", () => {
    laws.semiring(
      FS.getSemiring<string>(),
      FS.getEq(Eq.eqString),
      fc.array(fc.array(fc.string())),
    )
  })
})
