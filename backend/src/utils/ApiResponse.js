export class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  send(res, statusCode = 200) {
    return res.status(statusCode).json(this);
  }
}

export const sendSuccess = (res, statusCode, message, data = null, meta = null) =>
  new ApiResponse(statusCode, message, data, meta).send(res, statusCode);
