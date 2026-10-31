import crypto from "node:crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating authentication tokens",
            [],
            error,
        );
    }
};

const getSafeUser = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    isEmailVerified: user.isEmailVerified,
});

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const username = req.body.username.trim().toLowerCase();
    const { password, fullName } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    const user = new User({
        email,
        username,
        password,
        fullName,
        isEmailVerified: false,
    });
    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "User with this email or username already exists");
        }
        throw error;
    }

    const verificationUrl = new URL(
        `/api/v1/auth/verify-email/${unHashedToken}`,
        process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`,
    ).toString();

    await sendEmail({
        email: user.email,
        subject: "Please verify your email",
        text: `Hello ${user.username}, verify your email by visiting: ${verificationUrl}`,
        html: `<p>Hello ${escapeHtml(user.username)}, verify your email by clicking <a href="${escapeHtml(verificationUrl)}">this link</a>.</p>`,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: getSafeUser(user) },
            "User registered successfully. Check your email to verify your account.",
        ),
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: new Date() },
    });

    if (!user) {
        throw new ApiError(400, "Email verification token is invalid or expired");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const identifier = (email || username)?.trim().toLowerCase();

    if (!identifier || !password) {
        throw new ApiError(400, "Email or username and password are required");
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: getSafeUser(user),
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return entities[character];
    });
}

const forgotPasswordRequest = asyncHandler (async (req, res)
=> {
    const {email} = req.body

    const user = await user.findOne ({email})

    if(!user) {
        throw new ApiError(404, "User does not exists", [])
    }
    const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExipry = tokenExpiry

    await user.save ({validateBeforeSave: false})
    
})

export { registerUser, verifyEmail, login, logoutUser };
