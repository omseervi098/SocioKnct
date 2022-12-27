const mongoose = require("mongoose");
const env = require("./environment");
//check if database exists

mongoose.connect(process.env.CODEIAL_MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//now check if the database exists

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});
module.exports = db;
