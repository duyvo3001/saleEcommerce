"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED = exports.OK = exports.SuccessResponse = void 0;
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');
class SuccessResponse {
    constructor({ message = "", statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} || null }) {
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
    constructor({ options = {}, message = "", statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}
exports.CREATED = CREATED;
//# sourceMappingURL=success.response.js.map