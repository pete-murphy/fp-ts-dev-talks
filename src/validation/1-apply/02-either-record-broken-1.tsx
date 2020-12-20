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
  Ap.sequenceS(E.Applicative)({
    username: pipe(
      state.username,
      E.fromPredicate(NonEmptyString.is, () => "Username required"),
    ),
    password: pipe(
      state.password,
      E.fromPredicate(NonEmptyString.is, () => "Password required"),
    ),
  })

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")

  const result = validate({ username, password })

  return (
    <Container>
      <p>
        A first attempt, using Either to validate a simpler form (we removed the
        password confirmation). The nice thing here is that we’re actually able
        to refine the input type of our form, so the validated result is encoded
        in the types. But we don’t have the correct error type for what we’re
        aiming to do. <em>What is the correct error type?</em> 🤔
      </p>
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
