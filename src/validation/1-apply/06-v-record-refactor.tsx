import React from "react"
import {
  ConfirmedPassword,
  Container,
  Label,
  useInput,
} from "src/validation/lib/exports"
import { NonEmptyString } from "io-ts-types"
import { pipe, Refinement } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"
import * as E from "fp-ts/lib/Either"
import * as Rd from "fp-ts/lib/Reader"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"

type FormState = {
  username: string
  password: string
  passwordConfirmation: string
}

type ValidatedFormState = {
  username: NonEmptyString
} & ConfirmedPassword

type Err = [keyof FormState, string]
type Errs = RNEA.ReadonlyNonEmptyArray<Err>

const requiredField = <K extends keyof FormState>(
  key: K,
  refinement: Refinement<
    FormState[K],
    ValidatedFormState[K]
  > = NonEmptyString.is,
): Rd.Reader<FormState, E.Either<Errs, ValidatedFormState[K]>> => fs =>
  pipe(
    fs[key],
    E.fromPredicate(refinement, (): Errs => [[key, "Required"]]),
  )

const ado = Ap.sequenceT(E.getApplicativeValidation(RNEA.getSemigroup<Err>()))

const validate = (
  state: FormState,
): E.Either<RNEA.ReadonlyNonEmptyArray<Err>, ValidatedFormState> =>
  pipe(
    ado(
      requiredField("username")(state),
      requiredField("password")(state),
      requiredField("passwordConfirmation")(state),
      E.fromPredicate(
        ConfirmedPassword.is,
        (): Errs => [
          ["password", "Passwords must match"],
          ["passwordConfirmation", "Passwords must match"],
        ],
      )(state),
    ),
    E.map(([username, _password, _passwordConfirmation, p]) => ({
      username,
      ...p,
    })),
  )

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")
  const [passwordConfirmation, setPasswordConfirmation] = useInput("")

  const result = validate({ username, password, passwordConfirmation })

  const errors = pipe(
    result,
    E.fold(
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
        With some further refactors, we’re now using getApplicativeValidation
        instead of our custom V type, and we’re pretty close to the original
        functionality. Note that there might be multiple errors per field, and
        because we’re using getFirstSemigroup we will only see the first error
        message. We can change the semigroup instance to get different behavior
        in the UI.
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
        <Label error={errors.passwordConfirmation}>
          Password
          <input
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </Container>
  )
}
