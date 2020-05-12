import React, { useState, FC } from "react"
import * as t from "io-ts"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"

const breed = t.record(t.string, t.array(t.string))
const breeds = t.type({ message: breed, status: t.string })

type Breed = t.TypeOf<typeof breed>
type Breeds = t.TypeOf<typeof breeds>
type MyError =
  | { _tag: "api"; error: Error }
  | { _tag: "decode"; error: t.Errors }

const apiError = (error: Error): MyError => ({ _tag: "api", error })
const decodeError = (error: t.Errors): MyError => ({ _tag: "decode", error })

export const TaskEither: FC = () => {
  const [data, setData] = useState<O.Option<E.Either<MyError, Breeds>>>(O.none)
  const [loading, setLoading] = useState<boolean>(false)

  const taskEither = pipe(
    TE.tryCatch(
      () => fetch("https://dog.ceo/api/breeds/list/all"),
      err => apiError(err instanceof Error ? err : new Error("unknown error")),
    ),
    TE.chain(res =>
      TE.tryCatch(
        () =>
          !res.ok ? Promise.reject(new Error(`Fetch call failed`)) : res.json(),
        err =>
          apiError(err instanceof Error ? err : new Error("unknown error")),
      ),
    ),
    TE.chainEitherK(json => pipe(breeds.decode(json), E.mapLeft(decodeError))),
    TE.bimap(
      err => {
        console.log(err)
        setLoading(false)
        setData(O.some(E.left(err)))
      },
      breeds => {
        console.log(breeds)
        setLoading(false)
        setData(O.some(E.right(breeds)))
      },
    ),
  )

  const handleClick = () => {
    setLoading(true)
    taskEither()
  }

  return (
    <>
      <h2>Example 2</h2>
      <button onClick={handleClick}>Fetch Data</button>
      <div className="data-container">
        <pre>
          {loading
            ? "Loading..."
            : pipe(
                data,
                O.fold(
                  () => <>Click "Fetch Data" to make api call.</>,
                  either =>
                    pipe(
                      either,
                      E.fold(
                        e => {
                          switch (e._tag) {
                            case "api":
                              return (
                                <pre style={{ color: "tomato" }}>
                                  {e.error.message}
                                </pre>
                              )
                            case "decode": {
                              return (
                                <pre style={{ color: "tomato" }}>
                                  {JSON.stringify(e, null, 2)}
                                </pre>
                              )
                            }
                          }
                        },
                        breeds => (
                          <ul>
                            {Object.entries(breeds.message).map(
                              ([breed, subbreeds]) => (
                                <>
                                  <li key={breed}>{breed}</li>
                                  {subbreeds.flatMap(breed =>
                                    breed !== "" ? (
                                      <li key={breed}>{breed}</li>
                                    ) : (
                                      <></>
                                    ),
                                  )}
                                </>
                              ),
                            )}
                          </ul>
                        ),
                      ),
                    ),
                ),
              )}
        </pre>
      </div>
    </>
  )
}
