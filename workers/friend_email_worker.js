const Queue = require('bull');
const env=require('../config/environment');
const createClient = require('redis').createClient;

const client = createClient({
    password: env.redis_password,
    socket: {
        host: 'redis-14455.c305.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14455
    }
});
const friendRequest=require('../mailers/friends_mailer');
const newFriendRequest=new Queue('friend-emails',`redis://default:${env.redis_password}@redis-14455.c305.ap-south-1-1.ec2.cloud.redislabs.com:14455`);
newFriendRequest.process(function(job,done){
    console.log('emails worker is processing a job',job.id);
    friendRequest.newFriendRequest(job.data.email,job.data.curruser);
    done();
});

module.exports=newFriendRequest;