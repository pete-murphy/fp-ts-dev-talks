import { ADT, matchI } from "ts-adt";
import { Functor2, Functor, Functor1 } from "fp-ts/lib/Functor";
import { URIS2, Kind2 } from "fp-ts/lib/HKT";
import { pipe, pipeable } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";

/**
 * 'These' represents a value that can be one or another value
 * (like Either), but also both values!
 */
type These<L, R> = ADT<{
  this: { this: L };
  that: { that: R };
  both: { this: L; that: R };
}>;

// boilerplate that makes HKT<'These', A, B> work:
declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    These: These<E, A>;
  }
}

// Easy: Problem #1

// implement mapThese
function mapThese<E, A, B>(fa: These<E, A>, f: (a: A) => B): These<E, B> {
  return matchI(fa)<These<E, B>>({
    this: thi => ({ _type: "this", this: thi.this }),
    that: that => ({ _type: "that", that: f(that.that) }),
    both: both => ({ _type: "both", this: both.this, that: f(both.that) })
  });
}

const theseFunctor: Functor2<"These"> = {
  URI: "These",
  map: mapThese
};

// Medium: Problem #2

// boilerplate that makes HKT<'Set', A, B> work:
declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Set: Set<A>;
  }
}

// write a Functor instance for Set:

function mapSet<A, B>(set: Set<A>, f: (x: A) => B): Set<B> {
  return new Set(Array.from(set).map(f));
}

const setFunctor: Functor1<"Set"> = {
  URI: "Set",
  map: mapSet
};

// Is setFunctor lawful (no)? If not, try to provide an example where it violates the laws

// unlawful example:
const S = pipeable(setFunctor);

const f = (n: number) => n % 10;
const g = (n: number) => ({ value: n });

pipe(new Set([5, 10, 15]), S.map(f), S.map(g));

// these values should be equal, but are not:
console.log(
  pipe(new Set([5, 10, 15]), S.map(f), S.map(g)),
  "==?",
  pipe(new Set([5, 10, 15]), S.map(flow(f, g)))
);

// Hard: Define the HKT mapping for Func,
//   and implement a Functor instance for it.
// Does it matter which type parameter you choose to map over?
type Func<A, B> = (a: A) => B;

// boilerplate that makes HKT<'These', A, B> work:
declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    Func: Func<E, A>;
  }
}

function mapFunc<E, A, B>(func: Func<E, A>, f: (x: A) => B): Func<E, B> {
  return e => f(func(e));
}

const funcFunctor: Functor2<"Func"> = {
  URI: "Func",
  map: mapFunc
};
