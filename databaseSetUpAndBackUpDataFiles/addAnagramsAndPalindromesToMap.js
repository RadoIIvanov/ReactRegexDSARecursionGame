const validWordsWithScoresAndPercentiles = require("./getInfoFromNGramFileAndCombine");
const {
  addAnagramsAndPalindromesToDictionary
} = require("./helperFunctionality");

module.exports = validWordsWithScoresAndPercentiles.then(
  addAnagramsAndPalindromesToDictionary
);
