const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const morgan = require("morgan");
require("dotenv").config();

const mongoose = require("mongoose");
// const User = require("./model/user");
// const Expense = require("./model/expense");
// const Income = require("./model/income");
// const Order = require("./model/orders");
// const Forgotpassword = require("./model/ForgotPasswordRequests");

const app = express();

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(morgan("combined", { stream: accessLogStream }));

const expenseRoutes = require("./routes/expenseRoutes");
const IncomeRoutes = require("./routes/incomeRoutes");
const signRoutes = require("./routes/signRoutes");
const primiumRoutes = require("./routes/primium");
const premiumFeaturesRoutes = require("./routes/premiumFeatures");
const forgotpwdRoutes = require("./routes/forgot");
const downloadRoutes = require("./routes/downloadRoutes");
const monthdataRoutes = require("./routes/monthDataRoutes");
const deleteRoutes = require("./routes/delete");

app.use("/password", forgotpwdRoutes);
app.use("/user", downloadRoutes);
app.use(monthdataRoutes);
app.use(primiumRoutes);
app.use(signRoutes);
app.use(expenseRoutes);
app.use(IncomeRoutes);
app.use("/premium", premiumFeaturesRoutes);
app.use("/delete", deleteRoutes);
app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

const port = process.env.PORT;

mongoose
  .connect(
    "mongodb+srv://ritik28:neelam%402023@myfirstcluster.ri9d5sj.mongodb.net/expense?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
