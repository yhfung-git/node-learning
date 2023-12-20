module.exports = (statusCode, errorMessage, next) => {
  const error = new Error(errorMessage);
  error.httpStatusCode = statusCode;
  return next(error);
};
