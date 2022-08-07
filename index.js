const express = require("express");
const router = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const db=require("./config/mongoose");
//Setting up static files
app.use(express.static("./assets"));
//extract style and script from subspages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(expressLayouts);
//Use express Router
app.use("/", require("./routes/index"));
//Setting up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');

app.listen(port, (err) => {
  if (err) {
    console.log(`Error : ${err}`);
    return;
  }
  console.log(`Server is running on port ${port}`);
});
