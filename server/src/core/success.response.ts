import { Response } from "express"

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created successfully'
}
interface Metadata {
    [key: string]: any;
}
export class SuccessResponse {
    private message: string;
    private status: number;
    private metadata: Metadata;
    constructor({ message = "", statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
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
    constructor({ options = {}, message = "", statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}