import fetch from "cross-fetch"
import { Task, map } from "fp-ts/lib/Task"
import { pipe } from "fp-ts/lib/pipeable"
import { Todo } from "src/task/types"

const getAllTodos: Task<Array<Todo>> = () =>
  fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json())

// Because it's a task, no need to do the thunk-wrapping ourselves, we can just `map`
const doneTodos: Task<Array<Todo>> = pipe(
  getAllTodos,
  map(todos => todos.filter(t => t.completed)),
)

doneTodos().then(console.log)
