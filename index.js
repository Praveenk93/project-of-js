import app from "./app.js";
import connectDB from "./db/connectDB.js";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

try {
    await connectDB();

    app.listen(port, () => {
        console.log(`Backend server listening on http://localhost:${port}`);
    });
} catch (error) {
    console.error("Failed to start backend:", error);
    process.exitCode = 1;
}
