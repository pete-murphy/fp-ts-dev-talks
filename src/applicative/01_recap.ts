import { map, array } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"

/*

Functor {
    map:  <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}

lift: <A, B>(f: (a: A) => B) => ((fa: F<A>) => F<B>)

Effectful program: `f: (a: A) => F<B>`
Pure Program: `g: (b: B) => C`
Compose the two by lifting `g`: `lift(g): (fb: F<B>) => F<C>`

or

lift(g): <A, B>((fa: F<A>) => F<B>)

or

map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>

or

// v2.x curried definition
map: <A, B>(f: (a: A) => B) => (fa: F<A>) => F<B> (exact same type as `lift`)

*/

// `f: (a: A) => F<B>` or in this case `f: (a: number) => Array<number>`
const f = (a: number) => [a]

// `g: (b: B) => C` or in this case `g: (b: number) => b * 2
const g = (b: number) => b * 2

// fa: F<A> or in this case Array<A>
const fa = f(4) //?

// map(g): (fa: F<A>) => F<B> or in this case map((n => n * 2)): (fa: Array<4>) => Array<8>
array.map(fa, g) //?

/*

Can we "lift" two arguments?

*/
