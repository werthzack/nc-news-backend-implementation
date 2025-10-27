exports.validateBody = (schema, data) => {
  const errors = {};

  for (const [key, expected] of Object.entries(schema)) {
    const actualType = typeof data[key];
    const valid = Array.isArray(expected)
      ? expected.includes(actualType)
      : actualType === expected;

    if (!valid) {
      errors[key] = `Expected ${
        Array.isArray(expected) ? expected.join(" or ") : expected
      }, got ${actualType}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
