export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppError";
    }
}

export class AppServerError extends AppError {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "ApiError";
    }
}



