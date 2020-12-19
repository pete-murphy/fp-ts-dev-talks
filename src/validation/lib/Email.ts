import * as t from "io-ts"

export interface EmailBrand {
  readonly Email: unique symbol
}

export type Email = t.Branded<string, EmailBrand>

export const isValidEmail = (str: string) =>
  str.includes("@") && str.includes(".")

export const Email = t.brand(
  t.string,
  (s): s is Email => isValidEmail(s),
  "Email",
)
