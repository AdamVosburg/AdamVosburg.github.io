class ApiError extends Error {
    constructor(
      statusCode,
      message = 'Something went wrong',
      isOperational = true,
      stack = ''
    ) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    static badRequest(msg) {
      return new ApiError(400, msg);
    }
  
    static unauthorized(msg = 'Unauthorized') {
      return new ApiError(401, msg);
    }
  
    static forbidden(msg = 'Forbidden') {
      return new ApiError(403, msg);
    }
  
    static notFound(msg = 'Not Found') {
      return new ApiError(404, msg);
    }
  
    static internalServer(msg = 'Internal Server Error') {
      return new ApiError(500, msg);
    }
  }
  
  module.exports = ApiError;