const nodemailer = require("../config/nodemailer");
//Another way of export method
const env = require("../config/environment");
exports.newFriendRequest = (friendemail, curruser) => {
  let htmlString = nodemailer.renderTemplate(
    {
      friend: curruser,
    },
    "/friend/new_friend.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: friendemail,
      subject: "Socioknct | New Friend Request",
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
