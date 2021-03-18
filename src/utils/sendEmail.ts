import nodemailer from 'nodemailer';

interface MailOptions {
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}

async function sendEmail(mailOptions: MailOptions) {
    const account = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });


    const info = await transporter.sendMail(mailOptions);

    console.log(`Message sent: ${info.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

export async function sendVerificationEmail(email: string, verificationCode: string) {
    return sendEmail({
        from: '"FPL Watch ⚽" <no.reply@fplwatch.com>',
        to: email,
        subject: 'Verify your account',
        text: 'Verify your email by entering this code: \n' + verificationCode,
        html: `
            <b>Verify your account for FPL Watch</b>
            <p>Copy the code below and enter it <a href='http://localhost:3000/verify'>here.</a></p>
            <p>${verificationCode}</p>
        `
    });
}