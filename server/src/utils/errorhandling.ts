export class HttpError extends Error {
    status: number;
    // name: string;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}