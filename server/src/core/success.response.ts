import { Response } from "express"

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

interface Metadata {
    [key: string]: any;
}
export class SuccessResponse {
    private message: string;
    private status: number;
    private metadata: Metadata | null;
    constructor({ message = "", statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} || null }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    public send(res: Response, header = {}) {
        return res.status(this.status).json(this)
    }
}
export class OK extends SuccessResponse {
    constructor({ message = "", metadata = {} }) {
        super({ message, metadata })
    }
}
export class CREATED extends SuccessResponse {
    private options: {};
    constructor({ options = {}, message = "", statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}