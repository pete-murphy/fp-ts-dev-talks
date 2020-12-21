import React from "react"
import {
  Container,
  Email,
  Label,
  PhoneNumber,
  useInput,
} from "src/validation/lib/exports"
import { pipe } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import { pipeable } from "fp-ts/lib/pipeable"

type FormState = {
  contact: string
}

// Can't refine the type without defining our own `altW`
type ValidatedFormState = string

const isPhoneNumber = (str: string) => (PhoneNumber.is(str) ? true : false)
const isEmail = (str: string) => (Email.is(str) ? true : false)

type Err = [keyof FormState, string]
type Errs = RNEA.ReadonlyNonEmptyArray<Err>

const validate = (state: FormState) =>
  pipe(
    E.fromPredicate(
      isPhoneNumber,
      (): Errs => [["contact", "Not a valid email"]],
    )(state.contact),
    V.alt(() =>
      E.fromPredicate(
        isEmail,
        (): Errs => [["contact", "Not a valid phone number"]],
      )(state.contact),
    ),
  )

export const Form = () => {
  const [contact, setContact] = useInput("")

  const result = validate({ contact })
  const errors = toFinalFormValidationErrors(result)

  return (
    <Container>
      <p>
        We can’t refine the success type without defining a custom V.altW.
        However we can accumulate errors. This might be useful for composing
        rules.
      </p>
      <form>
        <Label error={errors.contact}>
          Contact
          <input value={contact} onChange={setContact} />
          <span role="img" className="icon">
            {pipe(
              result,
              E.fold(
                () => "",
                r => (PhoneNumber.is(r) ? "☎️" : "📭"),
              ),
            )}
          </span>
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    </Container>
  )
}

const V = pipeable(E.getAltValidation(RNEA.getSemigroup<Err>()))

const semigroupCommaSeparatedStrings: Sg.Semigroup<string> = {
  concat: (x, y) => `${x}, ${y}`,
}

type FinalFormValidationErrors = Partial<{ [K in keyof FormState]: string }>

const toFinalFormValidationErrors: (
  result: E.Either<Errs, ValidatedFormState>,
) => FinalFormValidationErrors = E.fold(
  RR.fromFoldable(semigroupCommaSeparatedStrings, RNEA.readonlyNonEmptyArray),
  () => RR.empty,
)
