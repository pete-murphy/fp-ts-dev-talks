import React from "react"
import { Route, NavLink } from "react-router-dom"

import "src/App.scss"
import { Example1 } from "src/either/Example1"
import { Example2 } from "src/either/Example2"
import { TaskExamples } from "src/task/TaskExamples"
import { TaskEither } from "src/task/4/taskEither"
import { Validation } from "src/validation/Validation"

export function App() {
  return (
    <div className="App">
      <header className="main">
        <h1>
          <code>fp-ts</code> FE Dev Talks Examples
        </h1>
        <nav>
          <NavLink to="/either/1">Either 1</NavLink>
          <NavLink to="/either/2">Either 2</NavLink>
          <NavLink to="/task">Task</NavLink>
          <NavLink to="/task-either">TaskEither</NavLink>
          <NavLink to="/validation">Validation</NavLink>
        </nav>
      </header>

      <main>
        <Route path="/either/1" component={Example1} />
        <Route path="/either/2" component={Example2} />
        <Route path="/task" component={TaskExamples} />
        <Route path="/task-either" component={TaskEither} />
        <Route path="/validation" component={Validation} />
      </main>
    </div>
  )
}
