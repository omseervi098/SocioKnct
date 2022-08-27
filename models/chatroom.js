const mongoose = require('mongoose');


const chatroomSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    user2 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Chat',
    }]
})

const Chatroom = mongoose.model('Chatroom',chatroomSchema);
module.exports = Chatroom;