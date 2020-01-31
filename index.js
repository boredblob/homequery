const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dvdRoute = require("./routes/dvd");
const bookRoute = require("./routes/book");

mongoose.connect(
  process.env.DB_CONNECT, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log("Connected to database");
  }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-App-Signature");
  next();
});

app.use(express.json());

app.use("/dvd", dvdRoute);
app.use("/book", bookRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});