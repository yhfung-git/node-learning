const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const {
  MAIL_USER,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
  OAUTH_REDIRECT_URI,
} = process.env;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET,
      OAUTH_REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject();
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MAIL_USER,
        accessToken,
        clientId: OAUTH_CLIENT_ID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    return transporter;
  } catch (err) {
    throw new Error(`Error creating transporter: ${err.message}`);
  }
};

const sendEmail = async (emailOptions) => {
  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendEmail };
