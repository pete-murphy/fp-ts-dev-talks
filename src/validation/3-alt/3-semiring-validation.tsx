import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import * as E from "fp-ts/lib/Either"
import { pipe, pipeable } from "fp-ts/lib/pipeable"
import * as E_ from "src/validation/lib/Either.ext"
import * as FS from "src/validation/lib/FreeSemiring"
import { eqString } from "fp-ts/lib/Eq"

type FormState = string

const validate = (state: FormState) =>
  pipe(
    E.fromPredicate(hasLengthBetween(8, 20), () =>
      FS.free("be between 8–20 characters long"),
    )(state),
    V.apFirst(
      E.fromPredicate(hasMixedCase, () =>
        FS.free("contain upper & lower-case letters"),
      )(state),
    ),
    V.alt(() =>
      pipe(
        E.fromPredicate(hasSpecialChar, () =>
          FS.free("contain a special character"),
        )(state),
        V.apFirst(
          E.fromPredicate(hasLengthBetween(5, 10), () =>
            FS.free("be between 5–10 characters long"),
          )(state),
        ),
      ),
    ),
    V.apFirst(
      E.fromPredicate(hasNumber, () => FS.free("contain a number"))(state),
    ),
    // V.alt(() => E.fromPredicate(beEqualTo("abc"), () => FS.free("be “abc”"))(state)),
  )

export const Form = () => {
  const [password, setPassword] = useInput("")

  const result = validate(password)
  const error = pipe(
    result,
    E.fold(
      xss =>
        `Password must ${[...xss].map(xs => xs.join(" AND ")).join(" OR ")}`,
      () => undefined,
    ),
  )

  return (
    <Container>
      <p>
        Things get interesting with Semiring. Let's say a password must have
        between 8–20 characters and include upper and lower-case letters, unless
        it has a special character, in which case it doesn't need mixed case and
        it can be between 5–10 characters long. All passwords must contain a
        number.
      </p>
      <form>
        <Label error={error}>
          Password
          <input value={password} onChange={setPassword} />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </Container>
  )
}

const V = pipeable(E_.getSemiringValidation(FS.getSemiring<string>(eqString)))

const hasLengthBetween = (min: number, max: number) => (str: string) =>
  str.length >= min && str.length <= max
const hasMixedCase = (str: string) => /[A-Z]/.test(str) && /[a-z]/.test(str)
const hasSpecialChar = (str: string) =>
  ["!", "%", "$", "*", "@", "^"].some(x => str.includes(x))
const hasNumber = (str: string) => /\d/.test(str)
const beEqualTo = (x: string) => (str: string) => x === str
