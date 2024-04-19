"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFailedError = exports.BadRequestError = exports.ConflictRequestError = void 0;
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
class AuthFailedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}
exports.AuthFailedError = AuthFailedError;