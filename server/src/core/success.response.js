"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED = exports.OK = exports.SuccessResponse = void 0;
const StatusCode = {
    OK: 200,
    CREATED: 201
};
const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created successfully'
};
class SuccessResponse {
    constructor({ message = "", statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor({ message = "", metadata = {} }) {
        super({ message, metadata });
    }
}
exports.OK = OK;
class CREATED extends SuccessResponse {
    constructor({ options = {}, message = "", statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}
exports.CREATED = CREATED;
