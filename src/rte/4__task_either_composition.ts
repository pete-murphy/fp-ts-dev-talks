import * as TE from 'fp-ts/lib/TaskEither';
import TaskEither = TE.TaskEither
import * as E from 'fp-ts/lib/Either';
import Either = E.Either
import { pipe } from 'fp-ts/lib/function';
import { User } from './3_task_either';

export type ApiError = {
  tag: 'ApiError',
  statusCode: number,
  message: string
}

// A generic fetch
declare const invokeFetch: (url: string) => TaskEither<ApiError, unknown>


export type DecodeError = {
  tag: 'DecodeError',
  message: string,
  badData: unknown
}

export type Decoder<T> = {
  decode: (u: unknown) => Either<DecodeError, T>
}

// a decoder
declare const decode: <T>(data: unknown, decoder: Decoder<T>) => TaskEither<DecodeError, T>


export declare const UserDecoder: Decoder<User>

const fetchUser = (userId: string) =>
  pipe(
    invokeFetch(`/api/users/${userId}`),
    TE.chainW(data => decode(data, UserDecoder))
  )

// fetchUser('asdf')().then(resp => {
//   return pipe(resp, E.fold(err => {
//     if(err.tag === 'ApiError') {
//       err.
//     } else {
//       err.
//     }
//   }, user => user))
// })




