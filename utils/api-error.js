class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        cause,
    ) {
        super(message, { cause });
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export { ApiError };
