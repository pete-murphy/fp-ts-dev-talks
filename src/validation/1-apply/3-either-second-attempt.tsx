/**
 * We have encoded that the error case is non-empty, but we're not getting all
 * errors at once, because Either short-circuits on the first Left
 */
import * as E from "fp-ts/lib/Either"
import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import { NonEmptyString } from "io-ts-types"
import { pipe } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"

type FormState = {
  username: string
  password: string
}

type ValidatedFormState = {
  username: NonEmptyString
  password: NonEmptyString
}

type Err = [keyof FormState, string]

type FormErrors = RNEA.ReadonlyNonEmptyArray<Err>

const validate = (state: FormState): E.Either<FormErrors, ValidatedFormState> =>
  Ap.sequenceS(E.Applicative)({
    username: pipe(
      state.username,
      E.fromPredicate(
        NonEmptyString.is,
        (): FormErrors => [["username", "Required"]],
      ),
    ),
    password: pipe(
      state.password,
      E.fromPredicate(
        NonEmptyString.is,
        (): FormErrors => [["password", "Required"]],
      ),
    ),
  })

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")

  const result = validate({ username, password })

  return (
    <Container>
      <p>
        I think if we want to encode the fact that the collection of errors{" "}
        <em>must be non-empty</em> whenever we end up on the error side of the
        validation, then a NonEmptyArray of some sort seems like a good
        candidate. That’s what we’re using here. However, we still don’t have
        the behavior that we want—our NonEmptyArray seems like it can only ever
        have one element! To explain that behavior, let’s review
        Apply/Applicative and Either’s instance thereof.
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
