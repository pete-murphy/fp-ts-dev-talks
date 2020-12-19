import * as t from "io-ts"

export interface ConfirmedPasswordBrand {
  readonly ConfirmedPassword: unique symbol
}

type P = { password: string; passwordConfirmation: string }

export type ConfirmedPassword = t.Branded<P, ConfirmedPasswordBrand>

export const isValidConfirmedPassword = ({
  password,
  passwordConfirmation,
}: P) => password === passwordConfirmation

export const ConfirmedPassword = t.brand(
  t.type({ password: t.string, passwordConfirmation: t.string }),
  (s): s is ConfirmedPassword => isValidConfirmedPassword(s),
  "ConfirmedPassword",
)
