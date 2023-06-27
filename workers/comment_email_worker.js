const Queue = require('bull');
const env=require('../config/environment');
const commentsMailer=require('../mailers/comments_mailer')
const emailQueue=new Queue('emails',`redis://default:${env.redis_password}@redis-16171.c301.ap-south-1-1.ec2.cloud.redislabs.com:16171`);
emailQueue.process(function(job,done){
    console.log('emails worker is processing a job',job.id);
    commentsMailer.newComment(job.data);
    done();
});
module.exports=emailQueue;
