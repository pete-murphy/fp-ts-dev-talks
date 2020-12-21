import { Alt2C } from "fp-ts/lib/Alt"
import { Applicative2C } from "fp-ts/lib/Applicative"
import { Bifunctor2 } from "fp-ts/lib/Bifunctor"
import { ChainRec2C } from "fp-ts/lib/ChainRec"
import * as E from "fp-ts/lib/Either"
import { Extend2 } from "fp-ts/lib/Extend"
import { Foldable2 } from "fp-ts/lib/Foldable"
import { Monad2C } from "fp-ts/lib/Monad"
import { MonadThrow2C } from "fp-ts/lib/MonadThrow"
import { Semiring } from "fp-ts/lib/Semiring"
import { Traversable2 } from "fp-ts/lib/Traversable"

export function getSemiringValidation<E = never>(
  SR: Semiring<E>,
): Monad2C<E.URI, E> &
  Foldable2<E.URI> &
  Traversable2<E.URI> &
  Bifunctor2<E.URI> &
  Alt2C<E.URI, E> &
  Extend2<E.URI> &
  ChainRec2C<E.URI, E> &
  MonadThrow2C<E.URI, E> {
  const applicativeValidation = getApplicativeSemiringValidation(SR)
  const altValidation = getAltSemiringValidation(SR)
  return {
    _E: undefined as any,
    ...E.either,
    ap: applicativeValidation.ap,
    alt: altValidation.alt,
  }
}

export function getApplicativeSemiringValidation<E>(
  SR: Semiring<E>,
): Applicative2C<E.URI, E> {
  return {
    URI: E.URI,
    _E: undefined as any,
    map: E.Functor.map,
    ap: (fab, fa) =>
      E.isLeft(fab)
        ? E.isLeft(fa)
          ? E.left(SR.mul(fab.left, fa.left))
          : fab
        : E.isLeft(fa)
        ? fa
        : E.right(fab.right(fa.right)),
    of: E.of,
  }
}

export function getAltSemiringValidation<E>(SE: Semiring<E>): Alt2C<E.URI, E> {
  return {
    URI: E.URI,
    _E: undefined as any,
    map: E.Functor.map,
    alt: (me, that) => {
      if (E.isRight(me)) {
        return me
      }
      const ea = that()
      return E.isLeft(ea) ? E.left(SE.add(me.left, ea.left)) : ea
    },
  }
}
