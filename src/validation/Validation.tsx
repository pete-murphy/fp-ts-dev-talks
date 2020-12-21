import { intercalate } from "fp-ts/lib/Foldable"
import { readonlyArray } from "fp-ts/lib/ReadonlyArray"
import React from "react"
import { Route } from "react-router"
import { NavLink } from "react-router-dom"
import { Form as ApplyExample1 } from "src/validation/1-apply/1-imperative-final-form"
import { Form as ApplyExample2 } from "src/validation/1-apply/2-either-first-attempt"
import { Form as ApplyExample3 } from "src/validation/1-apply/3-either-second-attempt"
import { Form as ApplyExample4 } from "src/validation/1-apply/4-custom-v-apply"
import { Form as ApplyExample5 } from "src/validation/1-apply/5-final-applicative-validation"
import { Form as ApplyExample6 } from "src/validation/1-apply/6-refactor-to-do-bonus"
import { Form as ChainExample1 } from "src/validation/2-chain/1-sync-example"
import { Form as ChainExample2 } from "src/validation/2-chain/2-async-example"
import { Form as AltExample1 } from "src/validation/3-alt/1-simple"
import { Form as AltExample2 } from "src/validation/3-alt/2-alt-validation"
import { Form as AltExample3 } from "src/validation/3-alt/3-semiring-validation"
import styled from "styled-components"
import { monoidJsx } from "src/validation/lib/Monoid"

const APPLY_COMPONENTS = [
  ApplyExample1,
  ApplyExample2,
  ApplyExample3,
  ApplyExample4,
  ApplyExample5,
  ApplyExample6,
]

const CHAIN_COMPONENTS = [ChainExample1, ChainExample2]

const ALT_COMPONENTS = [AltExample1, AltExample2, AltExample3]

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
        {intercalate(monoidJsx, readonlyArray)(
          <>|</>,
          CHAIN_COMPONENTS.map((_, ix) => (
            <NavLink to={`/validation/chain/${ix + 1}`}>{ix + 1}</NavLink>
          )),
        )}
      </nav>
      <nav>
        <h3>Alt/Alternative</h3>
        {intercalate(monoidJsx, readonlyArray)(
          <>|</>,
          ALT_COMPONENTS.map((_, ix) => (
            <NavLink to={`/validation/alt/${ix + 1}`}>{ix + 1}</NavLink>
          )),
        )}
      </nav>
    </Header>
    <section>
      {APPLY_COMPONENTS.map((C, ix) => (
        <Route path={`/validation/apply/${ix + 1}`} component={C} />
      ))}
      {CHAIN_COMPONENTS.map((C, ix) => (
        <Route path={`/validation/chain/${ix + 1}`} component={C} />
      ))}
      {ALT_COMPONENTS.map((C, ix) => (
        <Route path={`/validation/alt/${ix + 1}`} component={C} />
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
