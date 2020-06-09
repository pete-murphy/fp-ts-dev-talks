import { array as A } from "fp-ts/lib/Array"

/*

Typeclass `Apply` to the rescue!

interface Apply<F> extends Functor<F> {
  ap: <C, D>(fcd: F<(c: C) => D>, fc: F<C>) => F<D>
}

*/

// Let's use our new typeclass!

// `f: (a: A) => F<B>` or in this case `f: (a: number) => Array<number>`
const f = (a: number) => [a]

// F<B> or in this case Array<number>
const fb = f(2)

// F<C> or in this case Array<number>
const fc = f(4)

// `g: (b: B) => (c: C) => D` or in this case `g: (b: number) => (c: number) => b * c`
const curryG = (b: number) => (c: number) => b * c

export const liftA2Array = <A, B, C>(
  f: (a: A) => (b: B) => C,
  fa: Array<A>,
  fb: Array<B>,
): Array<C> => {
  // We call our `lift` (map) function on our lifted `A` value, to run a function on the value and eventually create a new value `D`.
  const fab = A.map(fa, f)

  // `ap` from `Apply` knows how to unpack `((b: number) => number)[]`! Woohoo!
  const fbc = A.ap(fab, fb)

  return fbc
}

liftA2Array(curryG, fb, fc) //?

/*

Awesome! Now that we have a typeclass for Apply, we can even use it on it's own!

*/

const cToD = curryG(2)

// A.ap(cToD, fc)

/*

Oh wait, we don't have a way of lifting our function into the same type as `fc`!

Is there a way we can possibly do that?

*/
