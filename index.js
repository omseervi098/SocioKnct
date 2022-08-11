const express = require("express");
const router = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const db=require("./config/mongoose");
//Used for session cookie
const session=require("express-session");
const passport=require("passport");
const passportLocal=require("./config/passport-local-strategy");
const MongoStore= require('connect-mongodb-session')(session);
app.use(express.urlencoded());
app.use(cookieParser());
//Setting up static files
app.use(express.static("./assets"));
//extract style and script from subspages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(expressLayouts);
//Setting up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');
//Middleware for session
app.use(session({
  name:'Codeial',
  //todo change secret before deployment
  secret:'blahsomething',
  saveUninitialized:false,
  resave:false,
  cookie:{
      maxAge:(1000*60*100),
  },
  //Storing MongoStore to store session cookie in mongodb
  store:new MongoStore({
      uri:'mongodb://localhost:27017/codial-development',
      collection:'db',
      autoRemove:'disabled'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//Use express Router
app.use("/", require("./routes/index"));
app.listen(port, (err) => {
  if (err) {
    console.log(`Error : ${err}`);
    return;
  }
  console.log(`Server is running on port ${port}`);
});
