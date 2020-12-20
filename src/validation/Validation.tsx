import { intercalate } from "fp-ts/lib/Foldable"
import { readonlyArray } from "fp-ts/lib/ReadonlyArray"
import React from "react"
import { Route } from "react-router"
import { NavLink } from "react-router-dom"
import { Form as ApplyExample1 } from "src/validation/1-apply/01-imperative-record"
import { Form as ApplyExample2 } from "src/validation/1-apply/02-either-record-broken-1"
import { Form as ApplyExample3 } from "src/validation/1-apply/03-either-record-broken-2"
import { Form as ApplyExample4 } from "src/validation/1-apply/05-v-record"
import { Form as ApplyExample5 } from "src/validation/1-apply/06-either-record-refactor"
import styled from "styled-components"
import { monoidJsx } from "src/validation/lib/Monoid"

const APPLY_COMPONENTS = [
  ApplyExample1,
  ApplyExample2,
  ApplyExample3,
  ApplyExample4,
  ApplyExample5,
]

export const Validation = () => (
  <>
    <Header>
      <nav>
        <h3>Apply/Applicative</h3>
        {intercalate(monoidJsx, readonlyArray)(
          <>|</>,
          APPLY_COMPONENTS.map((_, ix) => (
            <NavLink to={`/validation/apply/${ix + 1}`}>{ix + 1}</NavLink>
          )),
        )}
      </nav>
      <nav>
        <h3>Chain/Monad</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <NavLink to="/validation/chain/1">1</NavLink>,
        ])}
      </nav>
      <nav>
        <h3>Alt/Alternative</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <NavLink to="/validation/alt/1">1</NavLink>,
        ])}
      </nav>
    </Header>
    <section>
      {APPLY_COMPONENTS.map((C, ix) => (
        <Route path={`/validation/apply/${ix + 1}`} component={C} />
      ))}
    </section>
  </>
)

const Header = styled.header`
  /* outline: 1px solid blue; */
  > * {
    /* outline: 1px solid red; */
  }
  h3 {
    display: inline-block;
    margin: 0;
    line-height: 2;
  }
  nav {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }
`
