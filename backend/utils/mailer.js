import nodemailer from "nodemailer";

export const sendEmail = async(to, subject, text) => {
try {
        const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
        });

        const info = await transporter.sendMail({
            from:'"Inngest TMS"',
            to,
            subject,
            text,
            html: `<p>${text}</p>`
        })

        console.log("Email sent:", info.messageId);
        return info;
} catch (error) {
    console.error("Error creating transporter:", error.message);
    throw new Error("Failed to send email");
}
}