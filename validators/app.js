import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb"}))
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || "http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], 
    allowedHeaders: ["content-type", "Authorization"],
}),
);

// import the routes

import healthCheckRouter from "../routes/healthcheck.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
import authRouter from "./routes/auth.routes.js"


app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/", authRouter);


app.get("/", (req, res) => {
    res.send("welcome to basecampy");
});

export default app;