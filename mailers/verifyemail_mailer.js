const nodemailer=require('../config/nodemailer');
//Another way of export method
exports.verifyEmailMail=(email,token)=>{
    let htmlString=nodemailer.renderTemplate({
        accessToken:token
    },'/verify_email/verifyemail.ejs')
    //console.log('Inside new forgetpass mailer');
    nodemailer.transporter.sendMail({
        from:'seerviom236@gmail.com',
        to:email,
        subject:'Hey! Confirm your email',
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