import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApiResponse } from "./utils/api-response.js";
import authRouter from "./routes/auth.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

app.get("/", (_req, res) => {
    res.send("welcome to basecampy");
});

app.use((error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode =
        Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const message =
        statusCode >= 500 ? "Internal server error" : error.message;

    if (statusCode >= 500) {
        console.error("Request failed:", error);
    }

    return res.status(statusCode).json({
        ...new ApiResponse(statusCode, null, message),
        errors: error.errors || [],
    });
});

export default app;
