const router = require("express").Router();
const dotenv = require("dotenv");
const crypto = require("crypto");
const mongoose = require("mongoose");

const purify = require("../purify");

const DVD = require("../model/DVD");
const {dvdValidation} = require("../validation");

dotenv.config();

router.get("/", async (req, res) => {
  DVD.find((err, dvd) => {
    if (err) {console.log(err)};
    res.status(200).send(dvd);
  });
});

router.post("/add", async (req, res) => {
  if (compareDigests(JSON.stringify(req.body), req.headers["x-app-signature"])) {
    const clean = {
      title: purify(req.body.title)
    };

    const {error} = dvdValidation(clean);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    const dvd = new DVD(clean);
  
    try {
      await dvd.save();
      res.status(200).send("Success!");
    } catch (err) {
      res.status(400).send(err);
    };
  } else {
    res.status(403).send("Access Denied");
  }
});

router.post("/remove", async (req, res) => {
  if (compareDigests(JSON.stringify(req.body), req.headers["x-app-signature"])) {
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
  } else {
    res.status(403).send("Access Denied");
  }
});

router.post("/edit", async (req, res) => {
  if (compareDigests(JSON.stringify(req.body), req.headers["x-app-signature"])) {
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
  } else {
    res.status(403).send("Access Denied");
  }
});

function digest(data) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_TOKEN)
    .update(data)
    .digest("hex");

  return hmac;
}

function compareDigests(data, key) {
  try {
    const signature = digest(data);
    return crypto.timingSafeEqual(Buffer.from(signature, "utf-8"), Buffer.from(key, "utf-8"));
  }
  catch {
    return false;
  }
}

module.exports = router;