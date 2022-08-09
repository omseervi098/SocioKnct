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
    //TODO Later
}
//Get login data
module.exports.createSession=function(req,res){
    //TODO Later
}