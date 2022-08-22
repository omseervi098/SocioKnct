const nodemailer=require('../config/nodemailer');
//Another way of export method
exports.newpass=(forgotpass)=>{
    let htmlString=nodemailer.renderTemplate({
        forgotpass:forgotpass
    },'/forgotpass/new_password.ejs')
    //console.log('Inside new forgetpass mailer');
    nodemailer.transporter.sendMail({
        from:'seerviom236@gmail.com',
        to:forgotpass.user.email,
        subject:'Hey! You have requested for new password',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent');
        return;
    })
}