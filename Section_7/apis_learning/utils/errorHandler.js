exports.errorHandler = (statusCode, errorMessage) => {
  const error = new Error(errorMessage);
  error.statusCode = statusCode;
  return error;
};
