


# What's an effect?

Any piece of code that changes anything **outside the boundaries of the return value**.

Examples:

1. mutations
2. network requests
3. Action dispatches (setState, dispatch)
4. click handlers


# Effects are needed to write programs.
# pure, referentially transparent values.

_Pure functional programming is all about delaying those effects until the last possible moment_

const [state, setState] = useState()


# Common pattern: Describe an effect with a value
# Monadic interface is useful

const io: IO<A>
const myA = io.run()

const taskA: Task<A>
const taskB(a: A): Task<B>

pipe(
  task,
  chain(a => taskB(a))
)
