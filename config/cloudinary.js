const cloudinary = require("cloudinary").v2;
const env = require("./environment");
const fs = require("fs");
cloudinary.config({
  cloud_name: "dpjlgwheh",
  api_key: "661248727777329",
  api_secret: env.cloudinary_secret_key,
});

module.exports = cloudinary;
