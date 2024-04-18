const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409 ,
    UNAUTHORIZED : 401
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad Request error',
    CONFLICT: 'conflict error',
    UNAUTHORIZED :''
}

class ErrorResponse extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

export class AuthFailedError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

