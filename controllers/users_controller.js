const User=require('../models/user');
module.exports.profile=function(req,res){
    User.findById(req.params.id,(err,user)=>{
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });
}
module.exports.login=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('../views/user_login');
}
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
    return res.redirect('/');
}
//Sign Out
module.exports.destroySession=function(req,res){
    req.logout(function(err){
        if(err){return next(err); }
        res.redirect('/');
    });
};