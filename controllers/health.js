const healthCheck = (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
    });
};

export { healthCheck };
