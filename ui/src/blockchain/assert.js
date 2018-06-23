class AssertionError extends Error {
  type = 'AssertionError' // since 'e instanceof AssertionError' is false: https://github.com/facebook/create-react-app/issues/2952
}

export default function assert(condition, description) {
  if (!condition) {
    throw new AssertionError(description || `Expected truthy value got ${condition}`)
  }
}

assert.equal = function (a, b, description) {
  if (a !== b) {
    throw new AssertionError(description || `Expected ${a} === ${b}`)
  }
}

assert.AssertionError = AssertionError