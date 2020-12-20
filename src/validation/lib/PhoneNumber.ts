import * as t from "io-ts"

export interface PhoneNumberBrand {
  readonly PhoneNumber: unique symbol
}

export type PhoneNumber = t.Branded<string, PhoneNumberBrand>

export const isValidPhoneNumber = (str: string) =>
  // Regex copy-pasted from StackOverflow 🙈
  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(str)

export const PhoneNumber = t.brand(
  t.string,
  (s): s is PhoneNumber => isValidPhoneNumber(s),
  "PhoneNumber",
)
