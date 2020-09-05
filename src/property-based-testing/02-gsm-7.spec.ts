/* eslint-disable no-multi-str */
import * as fc from "fast-check"
import gsm7 from "./gsm-7"

const char7bits = (): fc.Arbitrary<string> =>
  fc.integer(0, 127).map(n => (gsm7.charset as Record<number, string>)[n])

describe("unit tests", () => {
  describe("encoding and decoding is a round-trip", () => {
    const cases: Array<[string]> = [
      [""],
      ["1"],
      ["1a"],
      ["1!"],
      ["0"],
      ["foo"],
      ["Hello, world!"],
      ["asdfghjklk';qwertyuiopp[[[zxcvbnm,,,,,,./QWERTYUIOPASDFGHJKL:ZXCVBNM<"],
      [
        "One morning, as Gregor Samsa was waking up from anxious dreams, \
he discovered that in his bed he had been changed into a monstrous \
verminous bug.",
      ],
      [
        "This sentence employs two a's, two c's, two d's, twenty-eight e's, \
five f's, three g's, eight h's, eleven i's, three l's, two m's, \
thirteen n's, nine o's, two p's, five r's, twenty-five s's, \
twenty-three t's, six v's, ten w's, two x's, five y's, and one z.",
      ],
      ["!*&^%?{}[]\\/<>,._+"],
    ]
    test.each(cases)("%s", str => {
      expect(gsm7.decode(gsm7.encode(str))).toEqual(str)
    })
  })
})

describe("property tests", () => {
  test("encoding and decoding is a round-trip", () => {
    fc.assert(
      fc.property(fc.stringOf(char7bits()), (str: string) => {
        expect(gsm7.decode(gsm7.encode(str))).toEqual(str)
      }),
      {
        numRuns: 10000,
        verbose: true,
        reporter: ({ failures }) => {
          if (failures.length > 0)
            throw new Error(failures.map(f => JSON.stringify(f)).join("\n"))
        },
      },
    )
  })

  xtest("decoding and encoding is a round-trip", () => {
    fc.assert(
      fc.property(fc.array(fc.nat(3)), ns => {
        const buff = Buffer.from(ns)
        expect(gsm7.encode(gsm7.decode(buff))).toEqual(buff)
      }),
    )
  })
})

// describe("unit tests", () => {
//   xdescribe("decode then encode", () => {
//     const cases: Array<[string, Array<number>]> = [
//       ["single", [1]],
//       ["just 0", [0]],
//       ["eight zeros", [0, 0, 0, 0, 0, 0, 0]],
//     ]
//     test.each(cases)("%s", (_, n) => {
//       const buff = Buffer.from(n)
//       expect(gsm7.encode(gsm7.decode(buff))).toEqual(buff)
//     })
//   })
//   describe("encode then decode", () => {
//     const cases: Array<[string, string]> = [
//       ["single", "1"],
//       ["just 0", "0"],
//       ["eight zeros", "00000000"],
//       ["seven zeros", "0000000"],
//       ["seven zeros", "0".repeat(8)],
//     ]
//     test.each(cases)("%s", (_, n) => {
//       expect(gsm7.decode(gsm7.encode(n))).toEqual(n)
//     })
//   })
// })
