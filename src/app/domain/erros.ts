export class AppServerError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "ApiError";
    }
}