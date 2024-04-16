"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.ConflictRequestError = void 0;
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
};
const ReasonStatusCode = {
    FORBIDDEN: 'Bad Request error',
    CONFLICT: 'conflict error'
};
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
