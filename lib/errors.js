/**
 * Usually goes with 400 status code
 * @typedef {object} APIValidationError
 * @property {object.<Array.<string>>} errors
 * @example
 * ```json
 * {
 *   "errors": {
 *     "fieldName": [
 *       "fieldName is not valid",
 *       ...
 *     ],
 *     ...
 *   }
 * }
 * ```
 */

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export class HttpError extends CustomError {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode || 500;
  }
}

export class FieldValidationError extends CustomError {
  constructor(field, message, statusCode = 400) {
    super(message);
    this.name = 'FieldValidationError';
    this.field = field || '';
    this.statusCode = statusCode;
  }
}

export class FieldsValidationError extends CustomError {
  constructor(fields, statusCode = 400) {
    super('Fields are invalid');
    this.name = 'FieldsValidationError';
    this.fields = fields || {};
    this.statusCode = statusCode;
  }
}

export class GoogleDriveInitializedError extends CustomError {
  constructor(statusCode = 500) {
    super('GoogleDrive is not initialized. Please call "setup" function first.');
    this.name = 'GoogleDriveInitializedError';
    this.statusCode = statusCode;
  }
}
