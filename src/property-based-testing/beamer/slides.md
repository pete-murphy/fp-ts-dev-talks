---
mainfont: SF Pro Text
monofont: SF Mono
fontsize: 10pt
---

# Property based testing

## GSM-7: A case study

. . .

Text encoding for SMS that packs a 7-bit character set into 8-bit bytes (so a 140-byte text message can contain 160 characters)

Wikipedia page: https://en.wikipedia.org/wiki/GSM_03.38

<!--
Show npm module
Example use of encoding/decoding

> How would you test this? Write a bunch of unit tests?

Try out `fast-check` with `fc.string` (note that this is ASCII strings)

Write our own `Arbitrary` using the character set directly

```typescript
const char7bits = (): fc.Arbitrary<string> =>
  fc.integer(0, 127).map(n => (gsm7.charset as Record<number, string>)[n])
```

More examples
Show the README: Jest, `query-string` et al.

-->

## Combining `Arbitrary`s

## Things that I've learned
Would be great to have metrics about this but... don't use `filter` on Arbitraries (EDIT: fine to use filter on Arbitraries, just don't reconstruct arrays on every iteration, stuff like that. Arbitraries generate 100s of tests so, forces you to be mindful about perf)



## 
