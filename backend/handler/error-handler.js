export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occurred!" });
}
