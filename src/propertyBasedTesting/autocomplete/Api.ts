import * as fc from "fast-check"
import { delay } from "fp-ts/lib/Task"
import faker from "faker"

const arbPerson = fc
  .integer()
  .noBias()
  .noShrink()
  .map(seed => {
    faker.seed(seed)
    return faker.fake("{{name.lastName}}, {{name.firstName}}")
  })

const results = fc.sample(arbPerson)

const randomInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)

export function search(query: string, maxResults: number): Promise<string[]> {
  const n = randomInRange(300, 500)
  return delay(n)(() =>
    Promise.resolve(
      results.filter(r => r.includes(query)).slice(0, maxResults),
    ),
  )()
}
