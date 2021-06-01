const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const itemSchema = require("../model/Item");

const purify = require("../purify");

router.post("/signup", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Username or password is not given."});
  }
  const hash = bcrypt.hashSync(req.body.password, 10);

  const username = purify(req.body.username);
  if (username !== req.body.username) {
    return res.status(400).json({message: "Username is not secure."});
  }

  try {
    const user = await new Promise((res, rej) => {
      User.findOne({username: username}, (err, user) => {
        if (err) rej(err);
        res(user);
      });
    });
    if (user) {
      return res.status(409).json({message: "User already exists"});
    }
  }
  catch(err) {
    return res.status(500).json({message: "Error while checking if user exists: " + err});
  }

  const user = new User({
    username: username, 
    password: hash
  });

  try {
    await user.save();
    mongoose.model("Item", itemSchema, username);
    res.status(201).json({message: "User saved"});
  }
  catch (err) {
    console.log(err);
    res.status(500).json({message: "Error while saving user."});
  }
});

router.post("/signin", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Username or password is not given."});
  }
  try {
    const user = await new Promise((res, rej) => {
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) rej(err);
        res(user);
      });
    });

    if (!user) {
      return res.status(401).json({message: "Username or password is incorrect."});
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          username: user.username
        },
        process.env.PRIVATE_KEY
      );
      return res.status(200).json({
        message: "Successfully logged in",
        token: token
      });
    } else {
      res.status(401).json({message: "Username or password is incorrect"});
    }
  }
  catch(err) {
    return res.status(401).json({message: "Auth failed" + err});
  }
});

module.exports = router;