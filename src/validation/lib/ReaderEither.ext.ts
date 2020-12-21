import { Alt3C } from "fp-ts/lib/Alt"
import { Applicative3C } from "fp-ts/lib/Applicative"
import { Bifunctor3C } from "fp-ts/lib/Bifunctor"
import * as RE from "fp-ts/lib/ReaderEither"
import * as E from "fp-ts/lib/Either"
import { Monad3C } from "fp-ts/lib/Monad"
import { MonadThrow3C } from "fp-ts/lib/MonadThrow"
import { Semiring } from "fp-ts/lib/Semiring"

export function getSemiringReaderValidation<E = never>(
  SR: Semiring<E>,
): Monad3C<RE.URI, E> &
  Alt3C<RE.URI, E> &
  Applicative3C<RE.URI, E> &
  Bifunctor3C<RE.URI, E> &
  MonadThrow3C<RE.URI, E> {
  const applicativeValidation = getApplicativeSemiringReaderValidation(SR)
  const altValidation = getAltSemiringReaderValidation(SR)
  return {
    _E: undefined as any,
    ...RE.readerEither,
    ap: applicativeValidation.ap,
    alt: altValidation.alt,
  }
}

export function getApplicativeSemiringReaderValidation<E>(
  SR: Semiring<E>,
): Applicative3C<RE.URI, E> {
  return {
    URI: RE.URI,
    _E: undefined as any,
    map: RE.Functor.map,
    ap: (frab, fra) => r => {
      const fab = frab(r)
      const fa = fra(r)
      return E.isLeft(fab)
        ? E.isLeft(fa)
          ? E.left(SR.mul(fab.left, fa.left))
          : fab
        : E.isLeft(fa)
        ? fa
        : E.right(fab.right(fa.right))
    },
    of: RE.of,
  }
}

export function getAltSemiringReaderValidation<E>(
  SE: Semiring<E>,
): Alt3C<RE.URI, E> {
  return {
    URI: RE.URI,
    _E: undefined as any,
    map: RE.Functor.map,
    alt: (mre, that) => r => {
      const me = mre(r)
      if (E.isRight(me)) {
        return me
      }
      const ea = that()(r)
      return E.isLeft(ea) ? E.left(SE.add(me.left, ea.left)) : ea
    },
  }
}
