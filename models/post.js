const mongoose=require('mongoose');

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //Include array of id of comments itself
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    //Include array of id of likes
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;