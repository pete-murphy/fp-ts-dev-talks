import fetch from "cross-fetch"
import { fold } from "fp-ts/lib/Monoid"
import { Task, getRaceMonoid, map } from "fp-ts/lib/Task"
import { Todo } from "src/task/types"
import { pipe } from "fp-ts/lib/pipeable"

const fetchTask1: Task<Todo> = () =>
  fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json())
const fetchTask2: Task<Todo> = () =>
  fetch("https://jsonplaceholder.typicode.com/todos/2").then(res => res.json())
const fetchTask3: Task<Todo> = () =>
  fetch("https://jsonplaceholder.typicode.com/todos/3").then(res => res.json())

const race = pipe(
  fold(getRaceMonoid<Todo>())([fetchTask1, fetchTask2, fetchTask3]),
  map(t => t.id),
)

race().then(console.log)
race().then(console.log)
race().then(console.log)
race().then(console.log)
race().then(console.log)
race().then(console.log)
race().then(console.log)
