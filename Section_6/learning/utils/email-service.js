const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const rootDir = require("./path");

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
    throw err;
  }
};

const generateEmailOptions = async (to, subject, template, data) => {
  try {
    // handle email content with a template
    const templatePath = path.join(
      rootDir,
      "views",
      "templates",
      `${template}.ejs`
    );

    const emailContent = await ejs.renderFile(templatePath, data);

    const emailOptions = {
      from: "'SHOP' my-own-email@gmail.com",
      to,
      subject,
      html: emailContent,
    };

    emailOptions.headers = { "Content-Type": "text/html" };

    return emailOptions;
  } catch (err) {
    throw err;
  }
};

const sendEmail = async (to, subject, template, data) => {
  try {
    // create transporter
    const emailTransporter = await createTransporter();

    // Generate email options
    const emailOptions = await generateEmailOptions(
      to,
      subject,
      template,
      data
    );

    // send email
    emailTransporter.sendMail(emailOptions);
  } catch (err) {
    throw err;
  }
};

module.exports = { sendEmail };
