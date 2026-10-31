import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, _res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map((error) => ({
        [error.path]: error.msg,
    }));

    return next(new ApiError(422, "Request validation failed", extractedErrors));
};
