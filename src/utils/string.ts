const reAlphaNumeric = /[a-zA-Z0-9]/;
const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

const asciiWords = (string: string): string[] => {
  return string.match(reAsciiWord) || []
}

export const splitWords = (text: string): string[] => {
  return asciiWords(text).filter(word => reAlphaNumeric.test(word));
}
