const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');
const logDirectory=path.join(__dirname,'../production_logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream=rfs.createStream('access.log',{
  interval:'1d',
  path:logDirectory
});
const development = {
  name: "development",
  asset_path:'./assets',
  session_cookie_key: "blahsomething",
  db: "codial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: "seerviom236",
      pass: "adruhdsxlqyvgyyh",
    },
  },
  google_clientID:
    "1035824478140-s28is5lsup8u1ja8c56ftpuersbhd542.apps.googleusercontent.com",
  google_clientSecret: "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",
  google_callbackURL: "http://localhost:3000/users/auth/google/callback",
  jwt_secret_key: "codeial",
  morgan:{
    mode:'dev',
    options:{stream:accessLogStream}
  }
};
const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB_NAME,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.CODEIAL_MAILER_USERNAME,
      pass: process.env.CODEIAL_MAILER_PASSWORD,
    },
  },
  google_clientID:process.env.CODEIAL_GOOGLE_CLIENTID,
  google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENTSECRET,
  google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACKURL,
  jwt_secret_key: process.env.CODEIAL_JWT_SECRET_KEY,
  morgan:{
    mode:'combined',
    options:{stream:accessLogStream}
  }
};

module.exports = eval(process.env.NODE_ENV)==undefined?development:eval(process.env.NODE_ENV);
