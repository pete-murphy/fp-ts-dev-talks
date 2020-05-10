import * as T from "fp-ts/lib/Task"
import { sequenceT } from "fp-ts/lib/Apply"
import { array } from "fp-ts/lib/Array"

/**
 * `T.taskSeq` has different behavior than `T.task` when using applicative
 * functions (like `sequence(T|S)`, `traverse`, or `ap`, etc.)
 */

const task100ms = T.delay(100)(T.of(1))
const task200ms = T.delay(200)(T.of(2))

// The regular `task` runs tasks in parallel ...
console.time("sequenceT(task)")
sequenceT(T.task)(task100ms, task200ms)().then(() =>
  console.timeEnd("sequenceT(task)"),
)

console.time("array.sequence(task)")
array
  .sequence(T.task)([task100ms, task200ms])()
  .then(() => console.timeEnd("array.sequence(task)"))

// ... while `taskSeq` runs tasks sequentially
console.time("sequenceT(taskSeq)")
sequenceT(T.taskSeq)(task100ms, task200ms)().then(() =>
  console.timeEnd("sequenceT(taskSeq)"),
)

console.time("array.sequence(taskSeq)")
array
  .sequence(T.taskSeq)([task100ms, task200ms])()
  .then(() => console.timeEnd("array.sequence(taskSeq)"))
