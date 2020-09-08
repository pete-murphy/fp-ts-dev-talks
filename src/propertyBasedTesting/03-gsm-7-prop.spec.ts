import * as fc from "fast-check"
import gsm7 from "./gsm-7"

const gsm7String = () =>
  fc.stringOf(
    fc
      .integer(0, 127)
      .noBias()
      .noShrink()
      .map(n => (gsm7.charset as Record<number, string>)[n]),
  )

describe("gsm-7", () => {
  test("encoding and decoding is a round-trip", () => {
    fc.assert(
      fc.property(gsm7String(), (str: string) => {
        expect(gsm7.decode(gsm7.encode(str))).toEqual(str)
      }),
    )
  })
})
