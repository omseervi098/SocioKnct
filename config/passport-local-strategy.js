const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
//Authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email'}
    ,function(email,password,done){
        //Find the user establish the session
        User.findOne({email:email},(err,user)=>{
            if(err){ 
                console.log("error in finding user"); 
                return done(err); 
            }
            if(!user || user.password!=password){
                console.log('Invalid username/password');
                return done(null,false);
            }
            return done(null,user);
        })
    }
));
//serialize user to decide which key is to be kept in the session
passport.serializeUser(function(user,done){
    done(null,user.id)
})
//Deserialize user from the key in cookies
passport.deserializeUser(function(user,done){
    User.findById(user,function(err,user){
        if(err){
            console.log('Error in finding user while deserializing');
            return done(err);
        }
        return done(null,user);
    })
})
module.exports=passport;