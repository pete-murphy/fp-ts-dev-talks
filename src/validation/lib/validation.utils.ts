import * as RE from "fp-ts/lib/ReaderEither"
import * as E from "fp-ts/lib/Either"
import * as Sr from "src/validation/lib/Semiring"
import * as RE_ from "src/validation/lib/ReaderEither.ext"
import { pipeable } from "fp-ts/lib/pipeable"

type Validator = RE.ReaderEither<string, Sr.FreeSemiring<string>, string>

export const hasLengthBetween = (min: number, max: number): Validator =>
  E.fromPredicate(
    (str: string) => str.length >= min && str.length <= max,
    () => [[`be between ${min}–${max} characters long`]],
  )

export const hasMixedCase: Validator = E.fromPredicate(
  (str: string) => /[A-Z]/.test(str) && /[a-z]/.test(str),
  () => [[`contain upper & lower-case letters`]],
)

export const hasNumber: Validator = E.fromPredicate(
  (str: string) => /\d/.test(str),
  () => [[`contain a number`]],
)

export const hasSpecialChar = E.fromPredicate(
  (str: string) => ["!", "%", "$", "*", "@", "^"].some(x => str.includes(x)),
  () => [[`contain a special character`]],
)

const V = RE_.getSemiringReaderValidation(Sr.getSemiring<string>())

export const { alt: or, apFirst: and } = pipeable<
  RE.URI,
  typeof V,
  Sr.FreeSemiring<string>
>(V)
