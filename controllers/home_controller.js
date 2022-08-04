module.exports.home=function(req,res){
    return res.end('<H1>Express is up for Codial</H1>');
}
module.exports.about=function(req,res){
    return res.end('<H1>About Us</H1>');
}