function ok(res, statusCode, data) {
  return res.status(statusCode).json({ data, error: null });
}

function fail(res, statusCode, message, details) {
  return res.status(statusCode).json({
    data: null,
    error: details ? { message, details } : { message },
  });
}

module.exports = { ok, fail };
