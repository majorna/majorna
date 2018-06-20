export default function assert(condition, description) {
  if (!condition) {
    throw new Error(description || 'Assertion error.')
  }
}

assert.equal = function (a, b, description) {
  if (a !== b) {
    throw new Error(description || `Expected ${a} === ${b}`)
  }
}
