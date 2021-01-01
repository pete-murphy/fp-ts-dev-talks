import * as RE from "fp-ts/lib/ReaderEither"
import * as E from "fp-ts/lib/Either"
import * as FS from "src/validation/lib/FreeSemiring"
import * as RE_ from "src/validation/lib/ReaderEither.ext"
import { pipeable } from "fp-ts/lib/pipeable"
import { eqString } from "fp-ts/lib/Eq"

type Validator = RE.ReaderEither<string, FS.FreeSemiring<string>, string>

export const hasLengthBetween = (min: number, max: number): Validator =>
  E.fromPredicate(
    (str: string) => str.length >= min && str.length <= max,
    () => FS.free(`be between ${min}–${max} characters long`),
  )

export const hasMixedCase: Validator = E.fromPredicate(
  (str: string) => /[A-Z]/.test(str) && /[a-z]/.test(str),
  () => FS.free(`contain upper & lower-case letters`),
)

export const hasNumber: Validator = E.fromPredicate(
  (str: string) => /\d/.test(str),
  () => FS.free(`contain a number`),
)

export const hasSpecialChar = E.fromPredicate(
  (str: string) => ["!", "%", "$", "*", "@", "^"].some(x => str.includes(x)),
  () => FS.free(`contain a special character`),
)

export const beEqualTo = (x: string): Validator =>
  E.fromPredicate(
    (str: string) => x === str,
    () => FS.free(`be “${x}”`),
  )

export const include = (x: string): Validator =>
  E.fromPredicate(
    (str: string) => str.includes(x),
    () => FS.free(`include “${x}”`),
  )

const V = RE_.getSemiringReaderValidation(FS.getSemiring<string>(eqString))

const { alt, apFirst } = pipeable<RE.URI, typeof V, FS.FreeSemiring<string>>(V)

// `or` is just a non-lazy version of `alt`
export const or = (that: Validator) => alt(() => that)
export const and = apFirst
