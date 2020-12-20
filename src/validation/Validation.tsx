import { intercalate } from "fp-ts/lib/Foldable"
import { readonlyArray } from "fp-ts/lib/ReadonlyArray"
import React from "react"
import { Route } from "react-router"
import { Link } from "react-router-dom"
import { Form as ApplyExample1 } from "src/validation/1-apply/01-imperative-record"
import { Form as ApplyExample2 } from "src/validation/1-apply/02-either-record-broken-1"
import { Form as ApplyExample3 } from "src/validation/1-apply/03-either-record-broken-2"
import { Form as ApplyExample4 } from "src/validation/1-apply/05-v-record"
import styled from "styled-components"
import { monoidJsx } from "./lib/Monoid"

export const Validation = () => (
  <>
    <Header>
      <nav>
        <h3>Apply/Applicative</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <Link to="/validation/apply/1">1</Link>,
          <Link to="/validation/apply/2">2</Link>,
          <Link to="/validation/apply/3">3</Link>,
          <Link to="/validation/apply/4">4</Link>,
        ])}
      </nav>
      <nav>
        <h3>Chain/Monad</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <Link to="/validation/chain/1">1</Link>,
        ])}
      </nav>
      <nav>
        <h3>Alt/Alternative</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <Link to="/validation/alt/1">1</Link>,
        ])}
      </nav>
    </Header>
    <section>
      <Route path="/validation/apply/1" component={ApplyExample1} />
      <Route path="/validation/apply/2" component={ApplyExample2} />
      <Route path="/validation/apply/3" component={ApplyExample3} />
      <Route path="/validation/apply/4" component={ApplyExample4} />
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
