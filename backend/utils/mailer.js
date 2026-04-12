import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, otp) {
    console.log("📩 Sending email via Nodemailer to:", to);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,   // your gmail
            pass: process.env.EMAIL_PASS    // app password (NOT normal password)
        }
    });

    const mailOptions = {
        from: `"Gym Buddy" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify your Gym Buddy account",
        html: `
            <div style="font-family:sans-serif">
                <h2>Welcome to Gym Buddy 💪</h2>
                <p>Your verification code:</p>
                <h1 style="letter-spacing:4px">${otp}</h1>
                <p>This code expires in 15 minutes.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        throw error;
    }
}