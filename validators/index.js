import { body } from "express-validator";

const userRegisterValidator = () => [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
        .normalizeEmail(),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lower case")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Password is required"),
    body("fullName")
        .optional()
        .isString()
        .withMessage("Full name must be a string")
        .trim(),
];

const userLoginValidator = () => [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .optional()
        .isString()
        .withMessage("Username must be a string"),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Password is required"),
    body().custom((value) => {
        if (!value.email && !value.username) {
            throw new Error("Email or username is required");
        }
        return true;
    }),
];

export { userRegisterValidator, userLoginValidator };
