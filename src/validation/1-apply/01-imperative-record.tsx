import React from "react"
import { Container, Label, useInput } from "src/validation/lib/exports"

type FormState = {
  username: string
  password: string
  passwordConfirmation: string
}

type ErrorMessage = string

type FormErrors = Partial<Record<keyof FormState, ErrorMessage>>

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {}
  if (!state.username) {
    errors.username = "Required"
  }
  if (!state.password) {
    errors.password = "Required"
  }
  if (!state.passwordConfirmation) {
    errors.passwordConfirmation = "Required"
  } else if (state.passwordConfirmation !== state.password) {
    errors.password = "Passwords must match"
    errors.passwordConfirmation = "Passwords must match"
  }
  return errors
}

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [password, setPassword] = useInput("")
  const [passwordConfirmation, setPasswordConfirmation] = useInput("")

  const errors = validate({ username, password, passwordConfirmation })

  return (
    <Container>
      <p>
        Our reference form, which implements imperative-style validation. The
        example is based on{" "}
        <a href="https://github.com/final-form/react-final-form/blob/master/docs/examples/record-level-validation.md">
          “Record Level Validation” example
        </a>{" "}
        from the React Final Form docs. We’ll endeavor to produce the same shape
        for the form errors, since our form components know how to display that,
        but using a functional approach with informative types.
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
          Password confirmation
          <input
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />
        </Label>
      </form>
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    </Container>
  )
}
