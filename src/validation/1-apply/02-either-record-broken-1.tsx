/**
 * A first attempt, using Either
 */
import * as E from "fp-ts/lib/Either"
import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import { NonEmptyString } from "io-ts-types"
import { pipe } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"

type FormState = {
  username: string
  password: string
}

type ValidatedFormState = {
  username: NonEmptyString
  password: NonEmptyString
}

type TODO = any

const validate = (state: FormState): E.Either<TODO, ValidatedFormState> =>
  Ap.sequenceS(E.either)({
    username: pipe(
      state.username,
      E.fromPredicate(NonEmptyString.is, () => "Required"),
    ),
    password: pipe(
      state.password,
      E.fromPredicate(NonEmptyString.is, () => "Required"),
    ),
  })

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")

  const result = validate({ username, password })

  return (
    <Container>
      <form>
        <Label>
          Username
          <input value={username} onChange={setUsername} />
        </Label>
        <Label>
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