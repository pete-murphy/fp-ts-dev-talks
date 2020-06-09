import { array as A } from "fp-ts/lib/Array"
/*

Effectful program: `f: (a: A) => F<B>`

Pass in two argurments as a tuple to our pure program: `g: (args: [B, C]) => D`

Rewrite our pure program to be curried: `g: (b: B) => (c: C) => D`

If we rewrite our `lift` function to take two "lifted" arguments instead:

liftA2(g): <B, C, D>(fb: F<B>) => (fc: F<C>) => F<D>

That allows our 

using original `lift`:

lift(g): <B, C, D>(fb: F<B>) => F<(c: C) => D>

*/

// `f: (a: A) => F<B>` or in this case `f: (a: number) => Array<number>`
const f = (a: number) => [a]

// `g: (args: [B, C]) => D` or in this case `g: (args: [number, number]) => args[0] * args[1]`
const g = (args: [number, number]) => args[0] * args[1]

// `g: (b: B) => (c: C) => D` or in this case `g: (b: number) => (c: number) => b * c`
const curryG = (b: number) => (c: number) => b * c

// F<B> or in this case Array<number>
const fb = f(2)

// F<C> or in this case Array<number>
const fc = f(4)

/*

`liftA2(g): <B, C, D>(fb: F<B>) => (fc: F<C>) => F<D>`

or in this case

`liftA2((b: number) => (c: number) => b * c): <number, number, number>(fb: Array<number>) => (fc: Array<number>) => Array<number>`

Let's Implement it!

*/

const liftA2Array = <A, B, C>(
  f: (a: A) => (b: B) => C,
  fa: Array<A>,
  fb: Array<B>,
): Array<C> => {
  // We call our `lift` (map) function on our lifted `A` value, to run a function on the value and eventually create a new value `D`.
  // However, there is a problem!
  const fab = A.map(fa, f)

  // We can't then run our function on our lifted `B` value because `lift` (map) doesn't know how to unpack `((b: number) => number)[]`
  const fbc = A.map(fb, fab)

  return fbc
}

/*

Is there a way that we can create something that will unpack `F<(c: C) => D>`?

*/
