const Queue = require('bull');
const commentsMailer=require('../mailers/comments_mailer')
const emailQueue=new Queue('emails','redis://127.0.0.1:6379');
emailQueue.process(function(job,done){
    console.log('emails worker is processing a job',job.id);
    commentsMailer.newComment(job.data);
    done();
});
module.exports=emailQueue;