import { Do } from 'fp-ts-contrib/lib/Do'
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import ReaderTaskEither = RTE.ReaderTaskEither
import * as E from 'fp-ts/lib/Either'
import { fetchUserRTE, fetchUser } from './5_a_reader_task_either_composition';



// async await:
const fetchUserAndManager = async (userId: string) => {
  const user = await fetchUser(fetch)(userId)
  if(E.isLeft(user)){
    return Promise.resolve(E.left(user.left))
  }

  const manager = await fetchUser(fetch)(user.right.managerId)

  if(E.isLeft(manager)){
    return Promise.resolve(E.left(manager.left))
  }

  return E.right({user: user.right, manager: manager.right});
}

interface Foo<R> {
  _a(r: R): void
}

type Bar = Foo<string> | Foo<number>

RTE.getOrElseW

// Do:
const fetchUserAndManagerRTE = (userId: string) => 
  Do(RTE.either)
    .bind("usera", fetchUserRTE(userId))
    .bind("user", fetchUserRTE(userId))
    .bindL("manager", ({user, usera}) => fetchUserRTE(usera.managerId))
    .return(({user, manager, usera}) => ({user, manager, usera}))



