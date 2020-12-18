import React from "react"
import { isValidEmail, useInput } from "./Form"
import styled from "styled-components"

type FormState = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

type FormErrors = {
  username?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {}
  if (!state.username) {
    errors.username = "Required"
  }
  if (!state.email) {
    errors.email = "Required"
  } else if (!isValidEmail(state.email)) {
    errors.email = "Must be valid email"
  }
  if (!state.password) {
    errors.password = "Required"
  }
  if (!state.passwordConfirmation) {
    errors.password = "Required"
  } else if (state.passwordConfirmation !== state.password) {
    errors.password = "Passwords must match"
    errors.passwordConfirmation = "Passwords must match"
  }
  return errors
}

export const Form = () => {
  const [username, setUsername] = useInput("")
  const [email, setEmail] = useInput("")
  const [password, setPassword] = useInput("")
  const [passwordConfirmation, setPasswordConfirmation] = useInput("")

  const errors = validate({ username, email, password, passwordConfirmation })

  return (
    <Container>
      <form>
        <Label error={errors.username}>
          Username
          <input value={username} onChange={setUsername} />
        </Label>
        <Label error={errors.email}>
          Email
          <input value={email} onChange={setEmail} />
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

const Label = styled.label<{ error?: string }>`
  font-size: 0.8rem;
  display: flex;
  flex-flow: column;
  gap: 0.2rem;
  /* outline: 1px solid green; */
  > input {
    border-color: ${({ error }) => (error ? `red` : `black`)};
    border-radius: 3px;
    border-style: solid;
    border-width: 2px;
    padding: 0.4rem;
    font-size: 1rem;
    background: ${({ error }) => (error ? `#ff000011` : `inherit`)};
  }
  &::after {
    content: ${({ error }) => (error ? `"${error}"` : `" "`)};
    display: block;
    height: 0.4rem;
    /* outline: 1px solid blue; */
    color: red;
    font-size: 0.6rem;
    font-weight: 600;
  }
`
const Container = styled.div`
  > * {
    /* outline: 1px solid red; */
  }
  display: grid;
  grid-template-columns: minmax(auto, 30ch) 1fr;
  gap: 4rem;
  > form {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }
`
