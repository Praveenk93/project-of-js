import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, text, html }) => {
    const { MAILTRAP_SMTP_HOST, MAILTRAP_SMTP_PORT, MAILTRAP_SMTP_USER, MAILTRAP_SMTP_PASS } =
        process.env;
    const port = Number(MAILTRAP_SMTP_PORT);

    if (
        !MAILTRAP_SMTP_HOST ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535 ||
        !MAILTRAP_SMTP_USER ||
        !MAILTRAP_SMTP_PASS
    ) {
        throw new Error("Valid SMTP settings must be configured to send email");
    }

    const transporter = nodemailer.createTransport({
        host: MAILTRAP_SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: MAILTRAP_SMTP_USER,
            pass: MAILTRAP_SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.MAIL_FROM || "Task Manager <no-reply@example.com>",
        to: email,
        subject,
        text,
        html,
    });
};

export { sendEmail };
