import { array } from "fp-ts/lib/Array"
import { Task, task } from "fp-ts/lib/Task"
import { sequenceS } from "fp-ts/lib/Apply"

/**
 * `Promise.all` is useful when you've got an array of promises, but would
 * prefer an promise of an array
 */

const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.resolve(3)

const arrayOfPromises: Array<Promise<number>> = [p1, p2, p3]

const promiseOfArray: Promise<Array<number>> = Promise.all(arrayOfPromises)

promiseOfArray.then(console.log)

/**
 * Turns out this is exactly what `sequence` does, but its more general:
 * ```
 * sequence
 *   :: forall a. (Traversable t, Applicative f)
 *   => t (f a)
 *   -> f (t a)
 * ```
 * It plays "leap-frog" with the `t` and `f` type constructors. In the
 * `Promise.all` case these happen to be fixed to `t ~ Array` and `f ~ Promise`.
 */

const t1 = task.of(1)
const t2 = task.of(2)
const t3 = task.of(3)

const arrayOfTasks: Array<Task<number>> = [t1, t2, t3]

const taskOfArray: Task<Array<number>> = array.sequence(task)(arrayOfTasks)

taskOfArray().then(console.log)

/**
 * Unlike `Promise.all`, we're not limited to using `sequence` with just `Array`.
 */

const recordOfTasks: Record<string, Task<number>> = { 1: t1, 2: t2, 3: t3 }

const taskOfRecord: Task<Record<string, number>> = sequenceS(task)(
  recordOfTasks,
)

taskOfRecord().then(console.log)
