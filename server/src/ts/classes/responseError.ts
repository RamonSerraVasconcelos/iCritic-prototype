export default class ResponseError {
    constructor(message?: string[], status?: number) {
        if (message) this.message = message.slice(0);
        this.status = status;
    }

    message?: string[];
    status?: number;
}
