# RTE: An Improvement on Promise

1. What's an effect?

2. ReaderTaskEither improves upon Promise
  A. Task
    - lazifies a promise
  B. Either
    - encodes errors
  C. Reader
    - lifts out dependencies

3. Composing `ReaderTaskEither`s
  A. map
  B. chain
  C. sequence/traverse
  D. Error types
  E. Dependency Types
  F. chainW

4. Using with `Do`

5. A real-world example, Defender Logs

Side notes:

RTE === ReaderTaskEither
fp-tsv2 notes, but everything still applies

