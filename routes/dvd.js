const router = require("express").Router();
const mongoose = require("mongoose");

const purify = require("../purify");
const {userAuth} = require("../auth");
const {find, save, remove, edit} = require("../collection");

const Item = require("../model/Item");

router.get("/:username/dvd/", userAuth, async (req, res) => {
  const dvds = await find({type: "dvd"}, req.params.username);
  res.status(200).json(dvds);
});

router.post("/:username/dvd/add", userAuth, async (req, res) => {
  const dvd = {
    title: purify(req.body.title),
    type: "dvd"
  };

  try {
    await save(dvd, req.params.username);
    res.status(200).send("Success!");
  } catch (err) {
    res.status(500).send(err);
  };
});

router.post("/:username/dvd/remove", userAuth, async (req, res) => {
  const id = purify(req.body.id);

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      await remove({_id: new mongoose.Types.ObjectId(id), type: "dvd"}, req.params.username);
      res.status(200).send("Removed");
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/:username/dvd/edit", userAuth, async (req, res) => {
  const id = purify(req.body.id);
  const title = purify(req.body.title);

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      await edit({_id: new mongoose.Types.ObjectId(id), type: "dvd"}, {title: title}, req.params.username);
      res.status(200).send("Edited");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;