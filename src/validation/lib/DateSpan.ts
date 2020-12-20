import * as t from "io-ts"
import { DateFromISOString, DateFromISOStringC } from "io-ts-types"

export interface DateSpanBrand {
  readonly DateSpan: unique symbol
}

type P = { startDate: Date; endDate: Date }

export type DateSpan = t.Branded<P, DateSpanBrand>

export const parseISOString = (str: string) => {
  const d = new Date(str)
  return d.toISOString()
}

export const isValidDateSpan = ({ startDate, endDate }: P) =>
  DateFromISOString.is(startDate) && DateFromISOString.is(endDate)

export const ConfirmedPassword = t.brand(
  t.type({ startDate: DateFromISOString, endDate: DateFromISOString }),
  (s): s is DateSpan => isValidDateSpan(s),
  "DateSpan",
)
