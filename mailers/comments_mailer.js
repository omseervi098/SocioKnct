const nodemailer = require("../config/nodemailer");
//Another way of export method
const env = require("../config/environment");
exports.newComment = (comment) => {
  let htmlString = nodemailer.renderTemplate(
    {
      comment: comment.comment,
    },
    "/comments/new_comment.ejs"
  );
  //console.log('Inside new comment mailer');
  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: comment.post.user.email,
      subject: "Socioknct | Updates ",
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
