exports.throwError = (code, message, data) => {
  const error = new Error(message);
  error.code = code;
  error.data = data ?? null;
  throw error;
};
