export default (condition, description) => {
  if (!condition) {
    throw new Error('Assertion error.', description)
  }
}