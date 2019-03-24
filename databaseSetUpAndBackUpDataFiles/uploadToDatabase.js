let mongoose = require("mongoose");
let envConfig = require("dotenv").config({ path: "../.env" });
let fs = require("fs");
const completeMap = require("./addAnagramsAndPalindromesToMap");

if (envConfig.error) {
  throw envConfig.error;
} else {
  console.log(envConfig.parsed);
}

let Schema = mongoose.Schema;

let dictionarySchema = new Schema({
  word: String,
  score: Number,
  percentile: Number,
  anagrams: Array,
  palindromeFlag: Boolean
});

mongoose.connect(
  `mongodb://${process.env.MONGO_USERNAME}:${
    process.env.MONGO_PASSWORD
  }@ds163164.mlab.com:63164/testingapi`,
  {
    useNewUrlParser: true
  }
);

let db = mongoose.connection;
db.on("error", err => console.log(err));
db.on(`open`, function() {
  console.log(`successfully connected!! yaya`);
  let DictionaryEntryModel = mongoose.model(
    "DictionaryEntryModel",
    dictionarySchema
  );

  completeMap.then(async function(dataToBeUploaded) {
    let iterator = dataToBeUploaded.entries();
    let currentEntry = "";
    while ((currentEntry = iterator.next().value)) {
      let word = currentEntry[0];
      let score = currentEntry[1].score;
      let percentile = currentEntry[1].percentile;
      let anagrams = currentEntry[1].anagrams;
      let palindromeFlag = currentEntry[1].palindromeFlag;
      let objToPassToTheDocumentConstructor = {
        word,
        score,
        percentile,
        anagrams,
        palindromeFlag
      };
      let newEntryDocument = new DictionaryEntryModel(
        objToPassToTheDocumentConstructor
      );
      await newEntryDocument.save();
    }
  });
});
