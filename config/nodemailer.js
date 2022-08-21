const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');

//Part which send emails
let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:true,
    auth:{
        user:'seerviom236',
        pass:'adruhdsxlqyvgyyh'
    }
});
//Sending html in email
let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
            }
            mailHTML=template;
        }
    );
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}