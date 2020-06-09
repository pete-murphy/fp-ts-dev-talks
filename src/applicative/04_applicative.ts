import { array as A } from "fp-ts/lib/Array"

/*

Typeclass `Applicative` to the rescue!

interface Applicative<F> extends Apply<F> {
  of: <A>(a: A) => F<A>
}

*/

// Let's use our new typeclass!

// `f: (a: A) => F<B>` or in this case `f: (a: number) => Array<number>`
const f = (a: number) => [a]

// F<C> or in this case Array<number>
const fc = f(4)

// `g: (b: B) => (c: C) => D` or in this case `g: (b: number) => (c: number) => b * c`
const curryG = (b: number) => (c: number) => b * c

const cToD = curryG(10)

A.ap(A.of(cToD), fc) //?

/*

Look at that!

We now have a very powerful tool in our toolbelt to lift any value into type if it has an applicative instance!

*/
