const fs = require("fs");
const rfs = require("rotating-file-stream");
const config = require("dotenv").config();
const path = require("path");
const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});
const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB_NAME,
  port: process.env.PORT,
  socketport: process.env.SOCKET_PORT,
  smtp: {
    pool: true,
    host: "us2.smtp.mailhostbox.com",
    port: 25,
    secure: false,
    auth: {
      user: process.env.CODEIAL_MAILER_USERNAME,
      pass: process.env.CODEIAL_MAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  google_clientID: process.env.CODEIAL_GOOGLE_CLIENTID,
  google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENTSECRET,
  google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACKURL,
  redis_password: process.env.CODEIAL_REDIS_PASSWORD,
  jwt_secret_key: process.env.CODEIAL_JWT_SECRET_KEY,
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};
const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB_NAME,
  port: process.env.PORT,
  socketport: process.env.SOCKET_PORT,
  smtp: {
    pool: true,
    host: "us2.smtp.mailhostbox.com",
    port: 25,
    secure: false,
    auth: {
      user: process.env.CODEIAL_MAILER_USERNAME,
      pass: process.env.CODEIAL_MAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  google_clientID: process.env.CODEIAL_GOOGLE_CLIENTID,
  google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENTSECRET,
  google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACKURL,
  redis_password: process.env.CODEIAL_REDIS_PASSWORD,
  jwt_secret_key: process.env.CODEIAL_JWT_SECRET_KEY,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports = production;
