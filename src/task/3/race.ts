import { getRaceMonoid, task, delay } from "fp-ts/lib/Task"

const task200ms = delay(200)(task.of(2))
const task100ms = delay(100)(task.of(1))

const race = getRaceMonoid<number>().concat(task200ms, task100ms)

race().then(console.log)
// -> logs "1"
