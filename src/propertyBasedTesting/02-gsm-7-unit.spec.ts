import gsm7 from "./gsm-7"

describe("gsm-7", () => {
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
