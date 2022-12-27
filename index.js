const express = require("express");
const config = require("dotenv").config();
const env = require("./config/environment");
const logger = require("morgan");
const router = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/view-helpers")(app);
const port = 3000;
const db = require("./config/mongoose");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
//Used for session cookie
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongodb-session")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const passportJWT = require("./config/passport-jwt-strategy");
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is running on port 5000");
chatServer.prependListener("request", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
});
if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
//Setting up static files
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(logger(env.morgan.mode, env.morgan.options));
//extract style and script from subspages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(expressLayouts);
//Setting up the view engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Middleware for session
app.use(
  session({
    name: "Codeial",
    //todo change secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    //Storing MongoStore to store session cookie in mongodb
    store: new MongoStore({
      uri: process.env.CODEIAL_MONGODB_URL,
      collection: "db",
      autoRemove: "disabled",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//Use express Router
app.use("/", require("./routes/index"));
app.listen(port, (err) => {
  if (err) {
    console.log(`Error : ${err}`);
    return;
  }
  console.log(`Server is running on port ${port}`);
});
