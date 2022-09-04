const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const user = require("./routes/users");

dotenv.config();

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", user);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running!");
});
