const nodemailer = require("../config/nodemailer");
//Another way of export method
const env = require("../config/environment");
exports.verifyEmailMail = (email, token) => {
  let htmlString = nodemailer.renderTemplate(
    {
      accessToken: token,
    },
    "/verify_email/verifyemail.ejs"
  );
  //console.log('Inside new forgetpass mailer');
  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: email,
      subject: "Socioknct | Confirm your email",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent");
      return;
    }
  );
};
