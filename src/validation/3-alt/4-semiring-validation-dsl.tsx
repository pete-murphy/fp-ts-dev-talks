import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import {
  and,
  hasLengthBetween,
  hasMixedCase,
  hasNumber,
  hasSpecialChar,
  or,
} from "src/validation/lib/validation.utils"

export const Form = () => {
  const [password, setPassword] = useInput("")

  const validate = pipe(
    // Password can either be between 8–20 chars with mixed case
    pipe(hasLengthBetween(8, 20), and(hasMixedCase)),
    // or if it has a special char, only needs to be 5–10 chars
    or(() => pipe(hasSpecialChar, and(hasLengthBetween(5, 10)))),
    // all passwords must contain a number
    and(hasNumber),
  )

  const result = validate(password)
  const error = pipe(
    result,
    E.fold(
      xss => `Password must ${xss.map(xs => xs.join(" AND ")).join(" OR ")}`,
      () => undefined,
    ),
  )

  return (
    <Container>
      <p>Same as the previous example, using a DSL for combining rules.</p>
      <form>
        <Label error={error}>
          Password
          <input value={password} onChange={setPassword} />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </Container>
  )
}
