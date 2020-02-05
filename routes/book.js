const router = require("express").Router();
const mongoose = require("mongoose");

const purify = require("../purify");
const {userAuth} = require("../auth");
const {find, save, remove, edit} = require("../collection");

const Item = require("../model/Item");

router.get("/:username/book/", userAuth, async (req, res) => {
  const books = await find({type: "book"}, req.params.username);
  res.status(200).json(books);
});

router.post("/:username/book/add", userAuth, async (req, res) => {
  const book = {
    title: purify(req.body.title),
    type: "book"
  };

  try {
    await save(book, req.params.username);
    res.status(200).send("Success!");
  } catch (err) {
    res.status(500).send(err);
  };
});

router.post("/:username/book/remove", userAuth, async (req, res) => {
  const id = purify(req.body.id);

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      await remove({_id: new mongoose.Types.ObjectId(id), type: "book"}, req.params.username);
      res.status(200).send("Removed");
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/:username/book/edit", userAuth, async (req, res) => {
  const id = purify(req.body.id);
  const title = purify(req.body.title);

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      await edit({_id: new mongoose.Types.ObjectId(id), type: "book"}, {title: title}, req.params.username);
      res.status(200).send("Edited");
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;