import React from "react"
import { Route, Link } from "react-router-dom"

import "src/App.scss"
import { Example1 } from "src/either/Example1"
import { Example2 } from "src/either/Example2"
import { TaskExamples } from "src/task/TaskExamples"
import { TaskEither } from "src/task/4/taskEither"

export function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <code>fp-ts</code> FE Dev Talks Examples
        </h1>
        <nav>
          <Link to="/either/1">Either 1</Link>
          <Link to="/either/2">Either 2</Link>
          <Link to="/task">Task</Link>
          <Link to="/taskeither">TaskEither</Link>
        </nav>
      </header>

      <main>
        <Route path="/either/1" component={Example1} />
        <Route path="/either/2" component={Example2} />
        <Route path="/task" component={TaskExamples} />
        <Route path="/taskeither" component={TaskEither} />
      </main>
    </div>
  )
}
