const nodemailer = require("../config/nodemailer");
const env = require("../config/environment");
//Another way of export method
exports.newpass = (forgotpass) => {
  let htmlString = nodemailer.renderTemplate(
    {
      forgotpass: forgotpass,
    },
    "/forgotpass/new_password.ejs"
  );
  //console.log('Inside new forgetpass mailer');
  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: forgotpass.user.email,
      subject: "Socioknct | Forgot Password",
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
