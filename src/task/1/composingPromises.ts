import fetch from "cross-fetch"
import { Todo } from "src/task/types"

/**
 * This would start running as soon as you construct it:
 * ```ts
 * const getAllTodos = fetch("https://jsonplaceholder.typicode.com/todos")
 * ```
 * which makes it hard to work with. (To paraphrase Runar: I'd rather work with
 * sticks of dynamite than with explosions.)
 */

const getAllTodos = (): Promise<Array<Todo>> =>
  fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json())

// In order to map over the return value, we would need to wrap it in a thunk anyways

const doneTodos = (): Promise<Array<Todo>> =>
  getAllTodos().then(todos => todos.filter(t => t.completed))

doneTodos().then(console.log)
