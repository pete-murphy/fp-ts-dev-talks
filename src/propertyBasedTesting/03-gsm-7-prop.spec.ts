import * as fc from "fast-check"
import gsm7 from "./gsm-7"

describe("gsm-7", () => {
  test("encoding and decoding is a round-trip", () => {
    fc.assert(
      fc.property(
        fc.string().filter(x => !x.includes("`")),
        (str: string) => {
          expect(gsm7.decode(gsm7.encode(str))).toEqual(str)
        },
      ),
    )
  })
})
