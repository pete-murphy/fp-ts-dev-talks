import React, { useState } from "react"
import * as t from "io-ts"
import { Either } from "fp-ts/lib/Either"

const todo = t.type({
  userId: t.number,
  id: t.number,
  title: t.string,
  completed: t.boolean,
})

const todos = t.readonlyArray(todo)

type Todo = t.TypeOf<typeof todo>
type Todos = t.TypeOf<typeof todos>

export function Example2() {
  const [data, setData] = useState<Either<t.Errors, Todos> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(response => response.json())
      .then(json => todos.decode(json))
      .then(setData)
      .finally(() => setLoading(false))
  }

  return (
    <>
      <h2>Example 2</h2>
      <button onClick={handleClick}>Fetch Data</button>
      <div className="data-container">
        <pre>{loading ? "Loading..." : JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  )
}
