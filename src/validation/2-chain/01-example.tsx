import React, { useEffect, useState } from "react"
import { Container, LabelAsync, useInput } from "src/validation/lib/exports"
import { DateFromISOString } from "io-ts-types"
import { flow, pipe } from "fp-ts/lib/function"
import * as Ap from "fp-ts/lib/Apply"
import * as TE from "fp-ts/lib/TaskEither"
import * as T from "fp-ts/lib/Task"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import * as Ord from "fp-ts/lib/Ord"

type FormState = {
  startDate: string
  endDate: string
}

type ValidatedFormState = {
  startDate: string
  endDate: string
}

type Err = [keyof FormState, string]
type Errs = RNEA.ReadonlyNonEmptyArray<Err>

const validate = (state: FormState): TE.TaskEither<Errs, ValidatedFormState> =>
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
    // parsing, before we can compare them. This dependency on the previous
    // return value makes this operation monadic.
    E.chain(
      E.fromPredicate(
        ({ startDate, endDate }) => Ord.lt(Ord.ordDate)(startDate, endDate),
        (): Errs => [["endDate", "Must be after start date"]],
      ),
    ),
    // At this point, we know the dates are valid, so we can prepare to send as
    // JSON values to our hypothetical API.
    E.map(({ startDate, endDate }) => ({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })),
    TE.fromEither,
    // Pretend there could be some further validation performed by backend at
    // this point.
    TE.chain(({ startDate, endDate }) =>
      TE.fromTask<Errs, ValidatedFormState>(
        // Simulating API call
        T.delay(1000)(T.of({ startDate, endDate })),
      ),
    ),
  )

export const Form = () => {
  const [startDate, setStartDate] = useInput("")
  const [endDate, setEndDate] = useInput("")
  // Using Option to signal loading state
  const [errors, setErrors] = useState<O.Option<FinalFormValidationErrors>>(
    O.some({}),
  )

  // @TODO - Pete Murphy 2020-12-20 - Cleaner way of accomplishing this?
  useEffect(() => {
    setErrors(() => O.none)
    pipe(
      validate({ startDate, endDate }),
      TE.fold(
        flow(
          RR.fromFoldable(
            Sg.getFirstSemigroup<string>(),
            RNEA.readonlyNonEmptyArray,
          ),
          T.of,
        ),
        () => T.of(RR.empty),
      ),
      T.map(flow(O.some, setErrors)),
      t => t(),
    )
  }, [startDate, endDate])

  return (
    <Container>
      <p>TODO: different from</p>
      <form>
        <LabelAsync
          error={pipe(
            errors,
            O.map(e => e.startDate),
          )}
        >
          Start date
          <input value={startDate} onChange={setStartDate} />
        </LabelAsync>
        <LabelAsync
          error={pipe(
            errors,
            O.map(e => e.endDate),
          )}
        >
          End date
          <input value={endDate} onChange={setEndDate} />
        </LabelAsync>
      </form>
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    </Container>
  )
}

const ado = Ap.sequenceS(E.getApplicativeValidation(RNEA.getSemigroup<Err>()))

type FinalFormValidationErrors = Partial<{ [K in keyof FormState]: string }>
