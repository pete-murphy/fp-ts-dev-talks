import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import { DateFromISOString } from "io-ts-types"
import { pipe } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"
import * as E from "fp-ts/lib/Either"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import * as Ord from "fp-ts/lib/Ord"

type FormState = {
  startDate: string
  endDate: string
}

type ValidatedFormState = {
  startDate: Date
  endDate: Date
}

type Err = [keyof FormState, string]
type Errs = RNEA.ReadonlyNonEmptyArray<Err>

const validate = (state: FormState): E.Either<Errs, ValidatedFormState> =>
  pipe(
    ado({
      startDate: pipe(
        state.startDate,
        DateFromISOString.decode,
        E.mapLeft((): Errs => [["startDate", "Failed to parse date"]]),
      ),
      endDate: pipe(
        state.endDate,
        DateFromISOString.decode,
        E.mapLeft((): Errs => [["endDate", "Failed to parse date"]]),
      ),
    }),
    // We need to parse the strings as dates, *and* use the output of the
    // parsing, before we can do the following comparisons. This dependency on
    // the previous return value makes this operation monadic.
    E.chainFirst(
      E.fromPredicate(
        ({ startDate }) => Ord.lt(Ord.ordDate)(new Date(), startDate),
        (): Errs => [["startDate", "Must be after today"]],
      ),
    ),
    E.chain(
      E.fromPredicate(
        ({ startDate, endDate }) => Ord.lt(Ord.ordDate)(startDate, endDate),
        (): Errs => [["endDate", "Must be after start date"]],
      ),
    ),
  )

export const Form = () => {
  const [startDate, setStartDate] = useInput("")
  const [endDate, setEndDate] = useInput("")

  const result = validate({ startDate, endDate })
  const errors = toFinalFormValidationErrors(result)

  return (
    <Container>
      <p>
        Synchronous example of monadic validation. We need to parse the input
        strings as dates before determining whether (1) the start date is after
        today and (2) the end date is after the start date. Because the
        subsequent validations (comparing dates) rely on the output of the
        previous validation (which turns the strings into dates), we are using
        Either’s Chain instance. <strong>Challenge:</strong> Can we check that
        the start date is after today without needing to parse the end date?
      </p>
      <form>
        <Label error={errors.startDate}>
          Start date
          <input value={startDate} onChange={setStartDate} />
        </Label>
        <Label error={errors.endDate}>
          End date
          <input value={endDate} onChange={setEndDate} />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    </Container>
  )
}

const V = E.getApplicativeValidation(RNEA.getSemigroup<Err>())
const ado = Ap.sequenceS(V)

type FinalFormValidationErrors = Partial<{ [K in keyof FormState]: string }>

const toFinalFormValidationErrors: (
  result: E.Either<Errs, ValidatedFormState>,
) => FinalFormValidationErrors = E.fold(
  RR.fromFoldable(Sg.getFirstSemigroup<string>(), RNEA.readonlyNonEmptyArray),
  () => RR.empty,
)
