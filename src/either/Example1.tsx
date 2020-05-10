import React, { useState } from "react"
import { Either, right, left, fold } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"

type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

export function Example1() {
  const [todos, setTodos] = useState<Either<string, ReadonlyArray<Todo>>>(
    left("Not loaded yet"),
  )

  const handleSuccess = (json: ReadonlyArray<Todo>) => {
    setTodos(right(json))
  }

  const handleClick = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(response => response.json())
      .then(handleSuccess)
  }

  return (
    <>
      <h2>Example 1</h2>
      <button onClick={handleClick}>Fetch Data</button>
      <div className="data-container">
        {pipe(
          todos,
          fold(
            e => <p style={{ color: "tomato" }}>{e}</p>,
            actualTodos => <pre>{JSON.stringify(actualTodos, null, 2)}</pre>,
          ),
        )}
        {/* {!error && !!.length && loaded && (
        )} */}
      </div>
    </>
  )
}
