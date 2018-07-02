class AssertionError extends Error {
  type = 'AssertionError' // since 'e instanceof AssertionError' is false: https://github.com/facebook/create-react-app/issues/2952
}

export default function assert(condition, failureDescription) {
  if (!condition) {
    throw new AssertionError(failureDescription || `Expected truthy value got ${condition}`)
  }
}

assert.equal = function (a, b, description) {
  if (a !== b) {
    throw new AssertionError(description || `Expected ${a} === ${b}`)
  }
}

assert.throws = async function (fn) {
  let err
  try {
    await fn()
  } catch (e) {
    err = e
  }
  assert(err, 'Expected exception but did not get one.')
}

assert.AssertionError = AssertionError