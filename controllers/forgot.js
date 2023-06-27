const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const forgotpassword = require("../model/ForgotPasswordRequests");
const uuid = require("uuid");
require("dotenv").config();

const forgotPwd = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
      const id = uuid.v4();
      await forgotpassword.create({
        id,
        isactive: true,
        userId: user._id,
      });
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "tiwari.ritik.1.108@gmail.com",
        name: "Ritik",
      };
      const recievers = [
        {
          email,
        },
      ];
      const doneEmail = await tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: `subscribe to expense app for more features`,
        htmlContent: `<h4>visit this link</h4><a href= "http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
      });
      return res.status(202).json("email sent successfully");
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: err, success: false });
  }
};

const resetPwd = async (req, res, next) => {
  try {
    const id = req.params.id;
    const gotit = await forgotpassword.findOne({ id: id });
    if (gotit.isactive === true) {
      await forgotpassword.updateOne(
        { id: gotit.id },
        {
          $set: {
            isactive: false,
          },
        }
      );
      res.status(200).send(`<html>
                                <form action="http://localhost:3000/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
    } else {
      res.status(404).send(`<h1>404 not found</h1>`);
    }
  } catch (err) {
    console.log(err);
  }
};

const updatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const resetpasswordid = req.params.id;
    const forpwd = await forgotpassword.findOne({
      id: resetpasswordid,
    });
    if (forpwd !== null) {
      const user = await User.findOne({
        _id: forpwd.userId,
      });
      if (user !== null) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            throw new Error(err);
          }
          bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
              throw new Error(err);
            }
            await user.updateOne({
              password: hash,
            });
            res
              .status(201)
              .json({ message: "Successfuly update the new password" });
          });
        });
      }
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (err) {
    res.status(403).json({ err, success: false });
  }
};

module.exports = { forgotPwd, resetPwd, updatepassword };
