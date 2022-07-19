const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const productRoute = require("./routes/products.js");
const orderRoute = require("./routes/orders.js");

const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("The connection is Successful!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);


app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
