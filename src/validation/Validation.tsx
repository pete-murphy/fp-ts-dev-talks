import { intercalate } from "fp-ts/lib/Foldable"
import { readonlyArray } from "fp-ts/lib/ReadonlyArray"
import React from "react"
import { Route } from "react-router"
import { Link } from "react-router-dom"
import { Form as ApplicativeExample1 } from "src/validation/1-applicative/01-imperative-record"
import { Form as ApplicativeExample2 } from "src/validation/1-applicative/02-either-record-broken-1"
import { Form as ApplicativeExample3 } from "src/validation/1-applicative/03-either-record-broken-2"
import { Form as ApplicativeExample4 } from "src/validation/1-applicative/04-either-record-broken-3"
import styled from "styled-components"
import { monoidJsx } from "./lib/Monoid"

export const Validation = () => (
  <>
    <Header>
      <nav>
        <h3>Applicative</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <Link to="/validation/applicative/1">1</Link>,
          <Link to="/validation/applicative/2">2</Link>,
          <Link to="/validation/applicative/3">3</Link>,
          <Link to="/validation/applicative/4">4</Link>,
        ])}
      </nav>
      <nav>
        <h3>Monadic</h3>
        {intercalate(monoidJsx, readonlyArray)(<>|</>, [
          <Link to="/validation/monadic/1">1</Link>,
          <Link to="/validation/monadic/2">2</Link>,
        ])}
      </nav>
    </Header>
    <section>
      <Route path="/validation/applicative/1" component={ApplicativeExample1} />
      <Route path="/validation/applicative/2" component={ApplicativeExample2} />
      <Route path="/validation/applicative/3" component={ApplicativeExample3} />
      <Route path="/validation/applicative/4" component={ApplicativeExample4} />
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
