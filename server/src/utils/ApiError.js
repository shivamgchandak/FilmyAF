export class ApiError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message, details) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, 'FORBIDDEN', message);
  }
  static notFound(message = 'Not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }
  static conflict(message) {
    return new ApiError(409, 'CONFLICT', message);
  }
  static outOfTakes(message = 'Out of takes', details) {
    return new ApiError(402, 'OUT_OF_TAKES', message, details);
  }
  static tooMany(message = 'Too many requests') {
    return new ApiError(429, 'TOO_MANY_REQUESTS', message);
  }
  static internal(message = 'Internal server error') {
    return new ApiError(500, 'INTERNAL', message);
  }
}
