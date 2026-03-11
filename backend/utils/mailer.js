import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(to, otp) {
    const msg = {
        to,
        from: process.env.EMAIL_FROM, // verified sender in SendGrid
        subject: "Verify your Gym Buddy account",
        html: `
            <p>Welcome! Please verify your email using the code below:</p>
            <h2>${otp}</h2>
            <p>This code will expire in 15 minutes.</p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("SendGrid Error:", error.response?.body || error.message);
        throw error;
    }
}