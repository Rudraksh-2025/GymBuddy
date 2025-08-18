import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // true for 465
    auth: {
        user: 'drexx2069@gmail.com',
        pass: 'xszwldjqwhnvcwhp'
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS)
        console.error('SMTP Error:', error);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

export async function sendVerificationEmail(to, otp) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Verify your Gym Buddy account",
        html: `
      <p>Welcome! Please verify your email using the code below:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 15 minutes.</p>
    `
    });
}


