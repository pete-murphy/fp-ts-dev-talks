import React from "react"
import {
  Container,
  isValidEmail,
  isValidPhoneNumber,
  Label,
  useInput,
} from "src/validation/lib/exports"
import { flow, pipe } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import * as Str from "fp-ts/lib/string"
import { makeMatchers } from "ts-adt/MakeADT"
const [match] = makeMatchers("tag")

type FormState = {
  contact: string
}

type Email = { readonly tag: "email"; readonly content: string }
type PhoneNumber = {
  readonly tag: "phoneNumber"
  readonly content: string
}
const email = (content: string): ValidatedFormState => ({
  tag: "email",
  content,
})
const phoneNumber = (content: string): ValidatedFormState => ({
  tag: "phoneNumber",
  content,
})
type ValidatedFormState = Email | PhoneNumber

type Err = readonly [keyof FormState, string]
type Errs = RNEA.ReadonlyNonEmptyArray<Err>

const validateEmail = flow(
  E.fromPredicate(isValidEmail, (): Errs => [["contact", "Not a valid email"]]),
  E.map(email),
)

const validatePhoneNumber = flow(
  E.fromPredicate(
    isValidPhoneNumber,
    (): Errs => [["contact", "Not a valid phone number"]],
  ),
  E.map(phoneNumber),
)

const validate = (state: FormState) =>
  pipe(
    validateEmail(state.contact),
    V_altW(() => validatePhoneNumber(state.contact)),
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
              E.match(
                () => "",
                match({ email: () => "✉️", phoneNumber: () => "☎️" }),
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

const V = E.getAltValidation(RNEA.getSemigroup<Err>())

export const V_altW: <B>(
  that: () => E.Either<Errs, B>,
) => <A>(fa: E.Either<Errs, A>) => E.Either<Errs, A | B> = that => fa =>
  V.alt(fa, that as any)

type FinalFormValidationErrors = Partial<{ [K in keyof FormState]: string }>

const toFinalFormValidationErrors: (
  result: E.Either<Errs, ValidatedFormState>,
) => FinalFormValidationErrors = E.fold(
  RR.fromFoldable(Sg.intercalate(", ")(Str.Semigroup), RNEA.Foldable),
  () => RR.empty,
)
