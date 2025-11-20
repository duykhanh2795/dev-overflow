import nodemailer from "nodemailer";
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function sendMail(mailOptions: nodemailer.SendMailOptions) {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "khanhnd.2795@gmail.com",
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.BASE_URL}/verify-email/${token}`;
  await sendMail({
    from: "khanhnd.2795@gmail.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
}
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.BASE_URL}/reset/${token}`;
  await sendMail({
    from: "khanhnd.2795@gmail.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
