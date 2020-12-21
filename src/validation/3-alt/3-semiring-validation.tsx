import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import * as E from "fp-ts/lib/Either"
import { pipe, pipeable } from "fp-ts/lib/pipeable"
import * as Sr from "src/validation/lib/Semiring"

type FormState = string

const validate = (state: FormState) =>
  pipe(
    pipe(
      E.fromPredicate(hasLengthBetween(8, 20), () => [
        ["be between 8—12 characters"],
      ])(state),
      V.apFirst(
        E.fromPredicate(hasMixedCase, () => [
          ["contain upper & lower-case letters"],
        ])(state),
      ),
    ),
    V.alt(() =>
      pipe(
        E.fromPredicate(hasSpecialChar, () => [["between 1 and 3"]])(state),
        V.apFirst(
          E.fromPredicate(hasLengthBetween(5, 10), () => [
            ["contain upper & lower-case letters"],
          ])(state),
        ),
      ),
    ),
    V.apFirst(E.fromPredicate(hasNumber, () => [["have upper case"]])(state)),
  )

export const Form = () => {
  const [contact, setContact] = useInput("")

  const result = validate(contact)
  const error = pipe(
    result,
    E.fold(
      xss => xss.map(xs => xs.join(" AND ")).join(" OR "),
      () => undefined,
    ),
  )

  return (
    <Container>
      <p>
        Things get interesting with Semiring. Let's say a password must have
        between 8—12 characters and include upper and lower-case letters, unless
        it has a special character, in which case it doesn't need mixed case and
        it can be between 5—10 characters long. All passwords must contain a
        number.
      </p>
      <form>
        <Label error={error}>
          Password
          <input value={contact} onChange={setContact} />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </Container>
  )
}

const V = pipeable(Sr.getSemiringValidation(Sr.getSemiring<string>()))

const hasLengthBetween = (min: number, max: number) => (str: string) =>
  str.length >= min && str.length <= max
const hasMixedCase = (str: string) => /A-Z/.test(str) && /a-z/.test(str)
const hasSpecialChar = (str: string) =>
  ["!", "%", "$", "*", "@", "^"].some(x => str.includes(x))
const hasNumber = (str: string) => /0-9/.test(str)
