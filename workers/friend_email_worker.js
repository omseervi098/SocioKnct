const Queue = require('bull');
const friendRequest=require('../mailers/friends_mailer');
const newFriendRequest=new Queue('friend-emails','redis://127.0.0.1:6379');
newFriendRequest.process(function(job,done){
    console.log('emails worker is processing a job',job.id);
    friendRequest.newFriendRequest(job.data.email,job.data.curruser);
    done();
});

module.exports=newFriendRequest;