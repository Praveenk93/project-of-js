import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const verifyjwt = asyncHandler(async (req, _res, next) => {
    const authorization = req.get("Authorization");
    const accessCookie = req
        .get("Cookie")
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("accessToken="))
        ?.slice("accessToken=".length);
    const token =
        accessCookie ||
        (authorization?.startsWith("Bearer ")
            ? authorization.slice("Bearer ".length)
            : undefined);

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    return next();
});
