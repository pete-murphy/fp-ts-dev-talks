import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import Task = T.Task;
import Option = O.Option;

// #region arrays
/**
 * Arrays
 */
const myArr: Array<string> = ["Bob", "Alice", "Sue"];

pipe(
  myArr,
  A.map(x => x.length)
); // [3, 5, 3]

// Array<A>
// A => B
// Array<B>


// #endregion

/**
 * Options
 */
const optionStr: Option<string> = O.some("foo");

pipe(
  optionStr,
  O.map(x => x.length)
); // some(3)

// Option<A>
// A => B
// Option<B>



/**
 * Task
 */
const taskStr: Task<string> = T.of("foo");

const bar = pipe(
  taskStr,
  T.map(x => x.length)
); // () => Promise<3>

T.map((x: string) => x.length)(taskStr)

// Task<A>
// A => B
// Task<B>








declare function mapA<A, B>(aa:  Array<A>, ab: (a: A) => B):  Array<B>
declare function mapO<A, B>(oa: Option<A>, ab: (a: A) => B): Option<B>
declare function mapT<A, B>(ta:   Task<A>, ab: (a: A) => B):   Task<B>


// generalized:

declare function map<F, A, B>(ta:    F<A>, ab: (a: A) => B):   F<B>





