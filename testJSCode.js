let envConfig = require("dotenv").config();
let mongoose = require("mongoose");

if (envConfig.error) {
  throw envConfig.error;
} else {
  console.log(envConfig.parsed);
}

mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${
    process.env.MONGO_PASSWORD
  }@ds163164.mlab.com:63164/testingapi`,
  {
    useNewUrlParser: true
  }
);
let db = mongoose.connection;

db.on("error", () => {
  console.log("test might");
});

db.on("open", () => {
  console.log(`we are connected!!! yaya`);
});
