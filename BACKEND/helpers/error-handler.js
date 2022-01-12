function errorHandler(err, req, res, next) {
  // Jwt Authentication error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" }); // Handler Erros in the API
  }

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  // Default 500 Server Error
  return res.status(500).json(err);
}

module.exports = errorHandler;
