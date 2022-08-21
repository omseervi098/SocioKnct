const nodemailer=require('../config/nodemailer');
//Another way of export method
exports.newComment=(comment)=>{
    let htmlString=nodemailer.renderTemplate({
        comment:comment
    },'/comments/new_comment.ejs')
    console.log('Inside new comment mailer');
    nodemailer.transporter.sendMail({
        from:'seerviom236@gmail.com',
        to:comment.user.email,
        subject:'New Comment on your post',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    })
}