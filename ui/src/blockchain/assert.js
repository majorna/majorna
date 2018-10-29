class AssertionError extends Error {
  type = 'AssertionError' // since 'e instanceof AssertionError' is false: https://github.com/facebook/create-react-app/issues/2952
}

export default function assert(condition, failureDescription) {
  if (!condition) {
    throw new AssertionError(failureDescription || `Expected truthy value got ${condition}`)
  }
}

assert.equal = function (a, b, failureDescription) {
  if (a !== b) {
    throw new AssertionError(failureDescription || `Expected ${a} === ${b}`)
  }
}

assert.notEqual = function (a, b, failureDescription) {
  if (!(a !== b)) {
    throw new AssertionError(failureDescription || `Expected ${a} !== ${b}`)
  }
}

// todo: use the same sig as node's assert.rejects
assert.throws = async function (fn, expectedErrorMsgIncludes) {
  let err
  try {
    await fn()
  } catch (e) {
    err = e
  }
  assert(err, 'Expected exception but did not get one.')
  expectedErrorMsgIncludes && assert(
    err.message.toLowerCase().includes(expectedErrorMsgIncludes.toLowerCase()),
    `Expected error message: "${err.message.toLowerCase()}" to include: "${expectedErrorMsgIncludes.toLowerCase()}".`)
}

assert.doesNotThrow = async function (fn, failureDescription) {
  try {
    await fn()
  } catch (e) {
    throw new AssertionError(failureDescription
      ? (typeof failureDescription === 'string' ? failureDescription : failureDescription(e))
      : `Expected no error, got one: ${e}`)
  }
}

assert.AssertionError = AssertionError