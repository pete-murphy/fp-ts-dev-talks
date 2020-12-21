/**
 * In which we use our custom V type to accumulate validation errors
 */
import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import { NonEmptyString } from "io-ts-types"
import { pipe } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"
import * as V from "src/validation/lib/V"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"

type FormState = {
  username: string
  password: string
}

type ValidatedFormState = {
  username: NonEmptyString
  password: NonEmptyString
}

type Err = [keyof FormState, string]

const validate = (state: FormState): V.V<Err, ValidatedFormState> =>
  Ap.sequenceS(V.Apply)({
    username: pipe(
      state.username,
      V.fromPredicate(NonEmptyString.is, (): Err => ["username", "Required"]),
    ),
    password: pipe(
      state.password,
      V.fromPredicate(NonEmptyString.is, (): Err => ["password", "Required"]),
    ),
  })

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")

  const result = validate({ username, password })

  const errors = pipe(
    result,
    V.fold(
      RR.fromFoldable(
        Sg.getFirstSemigroup<string>(),
        RNEA.readonlyNonEmptyArray,
      ),
      () => RR.empty,
    ),
  )

  return (
    <Container>
      <p>
        Finally, we’ve got a meaningful type for the output of our validation,
        and we can transform it into the record of errors that our form UI knows
        how to display.
      </p>
      <form>
        <Label error={errors.username}>
          Username
          <input value={username} onChange={setUsername} />
        </Label>
        <Label error={errors.password}>
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
