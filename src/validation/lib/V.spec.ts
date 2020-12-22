import * as laws from "fp-ts-laws"

import * as V from "src/validation/lib/V"

describe("V", () => {
  it("should be a lawful Apply", () => {
    laws.apply(V.Apply)
  })
})
