class AssertionError extends Error {}

export default function assert(condition, description) {
  if (!condition) {
    throw new AssertionError(description || 'Assertion error.')
  }
}

assert.equal = function (a, b, description) {
  if (a !== b) {
    throw new AssertionError(description || `Expected ${a} === ${b}`)
  }
}

assert.AssertionError = AssertionError