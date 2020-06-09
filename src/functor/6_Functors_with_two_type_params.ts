import * as E from 'fp-ts/lib/Either'
import Either = E.Either;
import { pipe } from 'fp-ts/lib/pipeable';
import * as Tup from 'fp-ts/lib/Tuple';


const eitherStr: Either<Error, string> = E.right("Bob")
const hmm = pipe(
  eitherStr,
  E.map(x => x.length),
  E.mapLeft(err => err.stack)
) // right(3)

const eitherErr: Either<Error, string> = E.left(new Error("oops"))
const hmm2 = pipe(
  eitherErr,
  E.map(x => x.length)
) // left(Error("oops"))


// Either<E, A>
// A => B
// Either<E, B>



const tupleStr: [string, number] = ["Bob", 84]
pipe(
  tupleStr,
  Tup.map(x => x.length),
  Tup.mapLeft(n => n.toString())
) // [3, "84"]



// Tuple<A, E>
// A => B
// Tuple<B, E>




