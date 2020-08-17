import * as RTE from "fp-ts/lib/ReaderTaskEither";
import ReaderTaskEither = RTE.ReaderTaskEither;
import { ApiError, Decoder, DecodeError, UserDecoder } from "./4__task_either_composition";
import { pipe } from "fp-ts/lib/function";


/**
 * Api Requests
 */

type FetchDep = {
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

declare const invokeFetch: (
  input: RequestInfo,
  init?: RequestInit
) => ReaderTaskEither<FetchDep, ApiError, unknown>;



/**
 * Decoding requests
 */

declare const decode: <T>(
  data: unknown,
  decoder: Decoder<T>
) => ReaderTaskEither<unknown, DecodeError, T>;



/**
 * Redux actions
 */

type ReduxStoreDep = {
  dispatch: <A extends {type: string}>(action: A) => A
};

declare const dispatch: <A extends {type: string}>(
  action: A
) => ReaderTaskEither<ReduxStoreDep, never, A>;






const retrieveUser = (userId: string) =>
  pipe(
    dispatch({type: 'FETCH_USER', payload: userId}),
    RTE.chainW(() => invokeFetch(`/api/users/${userId}`)),
    RTE.chainW(data => decode(data, UserDecoder)),
    RTE.chainW(user => dispatch({type: 'RECEIVED_USER', payload: user}))
  )

declare const dispatchFoo: <A extends {type: string}>(action: A) => A;

retrieveUser('foo')({ dispatch: dispatchFoo, fetch })
