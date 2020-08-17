import * as T from 'fp-ts/lib/Task';
import Task = T.Task
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';


const urls = ['user/1', 'user/2', 'user/3']


// considering: 
declare const fetch: (url: string) => Promise<unknown>

// naive version:
pipe(
  urls.map(url => fetch(url)), // Array<Promise<unknown>>
  Promise.all // Promise<Array<unknown>>
)



// better version:
urls
  .map(url => () => fetch(url)) // Array<() => Promise<unknown>>
  .reduce((acc, fp) =>
    acc.then(prevs => 
      fp().then(next => 
        [...prevs, next]
      )
    ),
    Promise.resolve([])
  )  // Promise<Array<unknown>>


// Task version:

// type Task<A> = () => Promise<A>
// It encodes laziness into a Promise by default!

declare const fetchTask: (url: string) => Task<unknown>

// parallel
pipe(
  urls.map(url => fetchTask(url)), // Array<Task<unknown>>
  A.array.sequence(T.task)         // Task<Array<unknown>
)

// sequential
const myTask = pipe(
  urls.map(url => fetchTask(url)),   // Array<Task<unknown>>
  A.array.sequence(T.taskSeq)        // Task<Array<unknown>
)








