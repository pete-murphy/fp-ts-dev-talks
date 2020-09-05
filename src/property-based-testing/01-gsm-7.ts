import gsm7 from "./gsm-7"

const sentence =
  "One morning, as Gregor Samsa was waking up from anxious dreams, \
he discovered that in his bed he had been changed into a monstrous \
verminous bug."

sentence.length

const sentenceEncoded = gsm7.encode(sentence)

sentenceEncoded.byteLength

gsm7.decode(sentenceEncoded) === sentence
