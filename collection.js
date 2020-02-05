const mongoose = require("mongoose");

function getCollection(collection_name) {
  return new Promise(res => {
    mongoose.connection.db.collection(collection_name, (err, collection) => {
      if (err) console.log(err);
      res(collection);
    });
  })
}

async function find(filter = {}, collection) {
  const c = (typeof collection === "string") ? await getCollection(collection) : collection;
  return new Promise(res => {
    c.find(filter).toArray((err, docs) => {
      if (err) console.log(err);
      res(docs);
    });
  })
}

async function save(doc, collection) {
  const c = (typeof collection === "string") ? await getCollection(collection) : collection;
  return new Promise((res, rej) => {
    c.insertOne(doc, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
}

async function remove(filter, collection) {
  const c = (typeof collection === "string") ? await getCollection(collection) : collection;
  return new Promise((res, rej) => {
    c.deleteOne(filter, (err, result) => {
      if (err) rej(err);
      res(result);
    })
  });
}

async function edit(filter, update, collection) {
  const c = (typeof collection === "string") ? await getCollection(collection) : collection;
  return new Promise((res, rej) => {
    c.updateOne(filter, {$set: update}, {upsert: false}, (err, result) => {
      if (err) rej(err);
      res(result.result.nModified);
    });
  });
}

module.exports.getCollection = getCollection;
module.exports.find = find;
module.exports.save = save;
module.exports.remove = remove;
module.exports.edit = edit;