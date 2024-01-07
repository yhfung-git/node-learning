exports.formatError = (err) => {
  if (!err.originalError) return err;

  const message = err.message || "An error occurred.";
  const status = err.originalError.code || 500;
  const path = err.path;
  const data = err.originalError.data;
  const stack = err.stack ? err.stack.split("\n") : [];

  return { message, status, path, data, stack };
};
