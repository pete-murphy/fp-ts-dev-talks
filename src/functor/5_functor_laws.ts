import { Kind, URIS, HKT } from 'fp-ts/lib/HKT';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import Option = O.Option;
import * as T from 'fp-ts/lib/Task';
import Task = T.Task;
import { pipe } from 'fp-ts/lib/pipeable';
import { identity } from 'fp-ts/lib/function';

/**
 * 
 * Identity Law
 * 
 * const a: F<A> = ???
 * 
 * pipe(a, F.map(x => x)) == a
 * 
 */

// Array
const myArr: Array<string> = ["Bob", "Alice", "Sue"];
pipe(
  myArr,
  A.map(x => x)
); // ["Bob", "Alice", "Sue"]

// Option
const optionStr: Option<string> = O.some("Bob");
pipe(
  optionStr,
  O.map(x => x)
); // some("Bob")




// Task
const taskStr: Task<string> = T.of("Bob");
pipe(
  taskStr,
  T.map(identity)
); // () => Promise("Bob")


/**
 * 
 * Composition Law
 * 
 * const f: A => B
 * const g: B => C
 * const a: F<A> = ???
 * 
 * pipe(
 *   a,
 *   F.map(f),
 *   F.map(g)
 * )
 * 
 * pipe(
 *   a,
 *   F.map( x => g(f(x)) ),
 * )
 * 
 */

const getLen: (s: string) => number = s => s.length
const square: (n: number) => number = n => n * n

myArr // ["Bob", "Alice", "Sue"]
pipe(
  myArr,
  A.map(getLen),
  A.map(square)
); // [9, 25, 9]
pipe(
  myArr,
  A.map(x => square(getLen(x))),
); // [9, 25, 9]


optionStr // Some("Bob")
pipe(
  optionStr,
  O.map(getLen),
  O.map(square)
); // Some(9)
pipe(
  optionStr,
  O.map(x => square(getLen(x))),
); // Some(9)



taskStr // () => Promise("Bob")
pipe(
  taskStr,
  T.map(getLen),
  T.map(square)
); // () => Promise(9)
pipe(
  taskStr,
  T.map(x => square(getLen(x))),
); // () => Promise(9)

