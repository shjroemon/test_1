const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../valuekeys");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
  res.send("Welcome");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "You need to provide all the information" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(200)
          .json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 123).then((hashedPassword) => {
        const user = new User({ name, email, password: hashedPassword });

        user
          .save()
          .then((user) => {
            res.json({ message: "User saved successfully" });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ error: "An error occurred while saving the user" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "please enter your email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //response.json({ message: "successfully signed in" });
          const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
          res.json({ token });
        } else {
          return res.status(422).json({ error: "Invalid password or email" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

module.exports = router;
