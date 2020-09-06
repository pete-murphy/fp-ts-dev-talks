import { Kind, URIS, HKT } from "fp-ts/lib/HKT";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import Option = O.Option;
import * as T from "fp-ts/lib/Task";
import Task = T.Task;

import { pipe } from "fp-ts/lib/pipeable";

// F<A>
// Kind<F, A> === F<A>

// Kind<"Option", string> == Option<string>

const myOptionStr: Kind<"Option", string> = O.some("foo");

interface Functor<F extends URIS> {
  URI: F;
  map<A, B>(fa: Kind<F, A>, ab: (a: A) => B): Kind<F, B>;
}

function erase<F extends URIS, A>(
  F: Functor<F>,
  fa: Kind<F, A>
): Kind<F, void> {
  return F.map(fa, () => void 0);
}

function getLength<F extends URIS>(
  F: Functor<F>
): <T extends { length: number }>(fxs: Kind<F, Array<T>>) => Kind<F, number> {
  return <T extends { length: number }>(fxs) =>
    F.map(fxs, (xs: T) => xs.length);
}

const foo: Option<string[]> = O.none;
const bar: Array<string[]> = [];

const wut = getLength(A.array)(bar);

const arrStr: Array<string> = ["Bob", "Alice", "Sue"];

const optionStr: Option<string> = O.some("Bob");

const taskStr: Task<string> = T.of("Bob");

const arr = erase(A.array, arrStr);
const opt = erase(O.option, optionStr);
const task = erase(T.task, taskStr);

type Id<A> = A;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly Id: Id<A>;
  }
}

function mapId<A, B>(ida: Id<A>, f: (a: A) => B): Id<B> {
  return f(ida);
}

const idFunctor: Functor<"Id"> = {
  URI: "Id",
  map: mapId
};

const myIdStr: Id<string> = "Bob";

const erased = erase(idFunctor, myIdStr);
