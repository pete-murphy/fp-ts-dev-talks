import * as TE from "fp-ts/lib/TaskEither";
import TaskEither = TE.TaskEither;
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import Either = E.Either;

const urls = ["user/1", "user/2", "user/3"];

export type User = {
  name: string;
  age: number;
  managerId: string;
};

declare const fetchUser: (userId: string) => Promise<User>;

// naive version:
fetchUser("1")
  .then((user) => {
    return `${user.name} is ${user.age} years old.`;
  })
  .catch((err) => {


  });

type ApiError = {
  statusCode: number;
  response: unknown;
};

declare const fetchUserEither: (
  userId: string
) => Promise<Either<ApiError, User>>;

// better version:
fetchUserEither("1").then(
  E.fold(
    (err) => {
      return err.statusCode === 404
        ? "Oops, that user doesn't exist"
        : "Oops, we encountered an error";
    },
    (user) => `${user.name} is ${user.age} years old.`
  )
);

// TaskEither version:

// type Task<A>          = () => Promise<A>
// type TaskEither<E, A> = () => Promise<Either<E, A>>

// TaskEither provides a place to hold errors

declare const fetchUserTE: (userId: string) => TaskEither<ApiError, User>;

const result = pipe(
  fetchUserTE("1"),
  TE.orElse((err) =>
    err.statusCode === 404 ? TE.right({ name: "Bob", age: 42 }) : TE.left(err)
  ),
  TE.map((user) => `${user.name} is ${user.age.toString()} years old.`)
);

const result2 = pipe(
  fetchUserTE("1"),
  TE.orElse((err) =>
    err.statusCode === 404 ? TE.right({ name: "Bob", age: 42 }) : TE.left(err)
  ),
  TE.map((user) => `${user.name} is ${user.age.toString()} years old.`)
);

// execute it later
result().then(
  E.fold(
    (err) => "Oops, we encountered an error",
    (message) => message
  )
)
