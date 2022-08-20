const jwt = require('jsonwebtoken');
const User=require('../../../models/user');
module.exports.createSession = async function (req, res) {
    try{
    let user= await User.findOne({email:req.body.email});
    if(!user||user.password!=req.body.password){
        return res.status(422).json({
            message:"Invalid username or password"
        })
    }
    if(user){
        return res.status(200).json({
            message:"Logged in successfully",
            data:{
                toke:jwt.sign(user.toJSON(),'codial',{expiresIn:'10000'})
            }
        })
    }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Error in finding user"
        })
    }
};