const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const dvdRoute = require("./routes/dvd");
const bookRoute = require("./routes/book");
const userRoute = require("./routes/user");

(async function() {
  await mongoose.connect(
    process.env.DB_CONNECT, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    () => {
      console.log("Connected to database");
    }
  );
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET, POST");
      return res.status(200).send("Woot");
    }
    next();
  });
  
  app.use(express.json());
  
  app.use("/", dvdRoute);
  app.use("/", bookRoute);
  app.use("/user", userRoute);
  
  const port = process.env.PORT || 8080;
  
  app.listen(port, () => {
    console.log("Server listening on port " + port);
  });
})();