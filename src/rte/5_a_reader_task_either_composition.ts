import * as RTE from "fp-ts/lib/ReaderTaskEither";
import ReaderTaskEither = RTE.ReaderTaskEither;
import * as E from "fp-ts/lib/Either";
import Either = E.Either;
import { User } from "./3_task_either";
import { ApiError } from "./4__task_either_composition";
import { pipe } from "fp-ts/lib/function";

// Promise<A>                 = Promise<A>
// Task<A>                    = () => Promise<A>
// TaskEither<E, A>           = () => Promise<Either<E, A>>
// ReaderTaskEither<R, E, A>  = (r: R) => Promise<Either<E, A>>

type Event = {
  name: string;
  start: Date;
};

// Extract the browser's 'fetch' function:
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export declare const fetchUser: (
  fetch: Fetch
) => (userId: string) => Promise<Either<ApiError, User>>;

declare const fetchEvent: (
  fetch: Fetch
) => (eventId: string) => Promise<Either<ApiError, Event>>;

// fetch the user, then fetch an event
fetchUser(fetch)("bob").then(
  E.fold(
    (err) => Promise.reject(err),
    (user) =>
      fetchEvent(fetch)("123").then(
        E.fold(
          (err) => Promise.reject(err),
          (event) => Promise.resolve([user, event] as const)
        )
      )
  )
);

export declare const fetchUserRTE: (
  userId: string
) => ReaderTaskEither<Fetch, ApiError, User>;

declare const fetchEventRTE: (
  eventId: string
) => ReaderTaskEither<Fetch, ApiError, Event>;

const getUserThenEvent = pipe(
  fetchUserRTE("bob"),
  RTE.chain((user) =>
    pipe(
      fetchEventRTE("123"),
      RTE.map((event) => [user, event] as const)
    )
  )
);

getUserThenEvent(fetch)

declare const mockedFetch: Fetch
getUserThenEvent(mockedFetch)
