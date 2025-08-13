import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: smtp.gmail.com,
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

export async function sendVerificationEmail(to, token) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Verify your Gym Buddy account',
        html:
            `<p>Welcome! Please verify your email by clicking the link below:</p>
         <a href="${verifyUrl}">Verify email</a>
        <p>This link expires in ${process.env.EMAIL_TOKEN_EXPIRES_IN || '1 day'}.</p>`
    });
}

