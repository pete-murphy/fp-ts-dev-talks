import React from "react"
import {
  ConfirmedPassword,
  Container,
  Label,
  useInput,
} from "src/validation/lib/exports"
import { NonEmptyString } from "io-ts-types"
import { pipe, Refinement } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
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

const validate = (
  state: FormState,
): E.Either<RNEA.ReadonlyNonEmptyArray<Err>, ValidatedFormState> =>
  pipe(
    // Using Do helper, unfortunately doesn't seem supported for Validation so
    // this has fail-fast semantics
    E.Do,
    E.apS("username", requiredField("username")(state)),
    E.apFirst(requiredField("password")(state)),
    E.apFirst(requiredField("passwordConfirmation")(state)),
    E.apS(
      "p",
      E.fromPredicate(
        ConfirmedPassword.is,
        (): Errs => [
          ["password", "Passwords must match"],
          ["passwordConfirmation", "Passwords must match"],
        ],
      )(state),
    ),
    E.map(({ username, p }) => ({
      username,
      ...p,
    })),
  )

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")
  const [passwordConfirmation, setPasswordConfirmation] = useInput("")

  const result = validate({ username, password, passwordConfirmation })

  const errors = toFinalFormValidationErrors(result)

  return (
    <Container>
      <p>
        Refactored to use E.Do. We are back to fail-fast behavior, since that’s
        the default for Either (we would need to define a V.apS function to get
        error accumulation).
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

// @TODO - Pete Murphy 2020-12-20 - Convert to library

const requiredField = <K extends keyof FormState>(
  key: K,
  refinement: Refinement<
    FormState[K],
    ValidatedFormState[K]
  > = NonEmptyString.is,
): ((fs: FormState) => E.Either<Errs, ValidatedFormState[K]>) => fs =>
  pipe(
    fs[key],
    E.fromPredicate(refinement, (): Errs => [[key, "Required"]]),
  )

const toFinalFormValidationErrors: (
  result: E.Either<Errs, ValidatedFormState>,
) => Partial<{ [K in keyof FormState]: string }> = E.fold(
  RR.fromFoldable(Sg.getFirstSemigroup<string>(), RNEA.readonlyNonEmptyArray),
  () => RR.empty,
)
