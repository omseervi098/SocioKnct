const User=require('../models/user');
module.exports.profile=function(req,res){
    return res.render('../views/user_profile');
}
module.exports.login=function(req,res){
    return res.render('../views/user_login');
}
module.exports.signUp=function(req,res){
    return res.render('../views/user_signup');
}
//Get signup data
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},(err,user)=>{
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body,(err,user)=>{
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/login');
            })
        }
        else{
            return res.redirect('back');
        }
    })
}
//Get login data
module.exports.createSession=function(req,res){
    //TODO Later
}