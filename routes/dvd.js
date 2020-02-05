const router = require("express").Router();
const mongoose = require("mongoose");

const purify = require("../purify");
const {userAuth} = require("../auth");

const DVD = require("../model/DVD");

router.get("/", userAuth, async (req, res) => {
  DVD.find((err, dvd) => {
    if (err) {console.log(err)};
    res.status(200).json(dvd);
  });
});

router.post("/add", userAuth, async (req, res) => {
  const clean = {
    title: purify(req.body.title)
  };

  const dvd = new DVD(clean);

  try {
    await dvd.save();
    res.status(200).send("Success!");
  } catch (err) {
    res.status(400).send(err);
  };
});

router.post("/remove", userAuth, async (req, res) => {
  const id = purify(req.body.id);

  if (mongoose.Types.ObjectId.isValid(id)) {
    DVD.deleteOne({_id: id}, err => {
      if (!err) {
        res.status(200).send("Removed");
      } else {
        res.status(400).send(err);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

router.post("/edit", userAuth, async (req, res) => {
  const id = purify(req.body.id);
  const title = purify(req.body.title);

  const {error} = dvdValidation({title: title});
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (mongoose.Types.ObjectId.isValid(id)) {
    DVD.updateOne({_id: id}, {title: title}, err => {
      if (!err) {
        res.status(200).send("Updated");
      } else {
        res.status(400).send(err);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;