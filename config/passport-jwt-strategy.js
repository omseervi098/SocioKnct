const passport=require("passport");
const JWTStrategy=require("passport-jwt").Strategy;
const ExtractJWT=require("passport-jwt").ExtractJwt;
const User=require("../models/user");
const env=require('./environment')
let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_secret_key
}
passport.use(new JWTStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err)
        {
            console.log("Error in finding user from JWT payload");
            return done(err,false);
        }
        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
}))

module.exports=passport;