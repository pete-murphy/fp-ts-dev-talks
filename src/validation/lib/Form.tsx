import styled from "styled-components"
import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"

export const Label = styled.label<{ error?: string }>`
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

export const LabelAsync = styled.label<{ error: O.Option<string | undefined> }>`
  font-size: 0.8rem;
  display: flex;
  flex-flow: column;
  gap: 0.2rem;
  /* outline: 1px solid green; */
  > input {
    /* border-color: ${({ error }) => (error ? `red` : `black`)}; */
    border-color: ${({ error }) =>
      pipe(
        error,
        O.fold(
          () => `gray`,
          e => (e ? `red` : `black`),
        ),
      )};
    border-radius: 3px;
    border-style: solid;
    border-width: 2px;
    padding: 0.4rem;
    font-size: 1rem;
    background: ${({ error }) =>
      pipe(
        error,
        O.fold(
          () => `inherit`,
          e => (e ? `#ff000011` : `inherit`),
        ),
      )};
  }
  &::after {
    content: ${({ error }) =>
      pipe(
        error,
        O.fold(
          () => `"Loading..."`,
          e => (e ? `"${e}"` : `" "`),
        ),
      )};
    display: block;
    height: 0.4rem;
    /* outline: 1px solid blue; */
    color: red;
    font-size: 0.6rem;
    font-weight: 600;
  }
`

export const Container = styled.div`
  /* outline: 1px solid green; */
  > * {
    /* outline: 1px solid red; */
  }
  > p {
    grid-column: 1 / -1;
    line-height: 1.4;
    max-width: 65ch;
    margin: auto;
  }

  display: grid;
  grid-template-columns: clamp(20ch, 50%, 30ch) 1fr;
  gap: 4rem;

  > form {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }

  > div {
    /* height: 4rem; */
    overflow: auto;
    /* outline: 1px solid red; */

    pre {
      overflow: auto;
      /* outline: 1px solid blue; */
      font-size: 1rem;
    }
  }
`
