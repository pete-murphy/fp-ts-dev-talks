import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as T from "fp-ts/lib/Task"

type F<A> = O.Option<A>
const F = O

type TODO = any

//    lift1 :: (a -> b) -> f a -> f b
const lift1 = <A, B>(f: (a: A) => B) => (fa: F<A>): F<B> => undefined as TODO

//    lift2 :: (a -> b -> c) -> f a -> f b -> f c
const lift2 = <A, B, C>(f: (a: A) => (b: B) => C) => (fa: F<A>) => (
  fb: F<B>,
): F<C> => undefined as TODO

//    lift3 :: (a -> b -> c -> d) -> f a -> f b -> f c -> f d
const lift3 = <A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D) => (
  fa: F<A>,
) => (fb: F<B>) => (fc: F<C>): F<D> => undefined as TODO

//    lift4 :: (a -> b -> c -> d -> e) -> f a -> f b -> f c -> f d -> f e
const lift4 = <A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E) => (
  fa: F<A>,
) => (fb: F<B>) => (fc: F<C>) => (fd: F<D>): F<E> => undefined as TODO
