/* Dummy data - 
arrOne = current UI grid
arrTwo = new UI grid
previouslyPlacedWordsCoordinates = locations of previously placed words:
  inRows array contains an outer array with an index representing the row number of the matrix. At each index there is an array of arrays containing the start/end of 
  each word in the particular row 
  *!*!*!*!* here you may want to include the actually placed words to perform the check for non-repeating words
dummyDataDictionaryAPI = what you might get from the API to present definition and determine score

*/

let arrOne = [
  ["", "", "", "", ""],
  ["a", "b", "p", "", ""],
  ["", "", "d", "g", "i"],
  ["", "l", "e", "", ""],
  ["", "", "", "", ""]
];
let arrTwo = [
  ["", "", "", "m", ""],
  ["a", "b", "p", "i", ""],
  ["", "", "d", "g", "i"],
  ["", "l", "e", "h", ""],
  ["", "", "", "t", ""]
];

let previouslyPlacedWordsCoordinates = {
  inRows: [[], [[0, 2]], [[2, 4]], [[1, 2]], []],
  inCols: [[], [], [[1, 3]], [], []]
};

let dummyDataDictionaryAPI = new Map();
dummyDataDictionaryAPI.set("might", {
  percentile: 0.3,
  definition: "Great and impressive power or strength"
});

let dummyDataSpellCheckAPI = new Map();
dummyDataSpellCheckAPI.set(["migh", "ight", "mighte", "miht"], "might");
//// we will have to check how things work when words can have multiple main definition (i.e. might as the p.p of the verb may, and might as a noun)

/* naive way - as we go along we can perform preliminary checks, extract letter, coordinates, and surrounding letters
  and return an array of objects*/

const matrixCellChecker = function(matrix, row, col) {
  if (matrix[row] && matrix[row][col]) {
    return true;
  } else {
    return false;
  }
};

const getPreviousItemInMap = function(map) {
  if (map.size > 1) {
    return Array.from(map.entries())[map.size - 2][0];
  } else {
    return Array.from(map.entries())[map.size - 1][0];
  }
};

const wordsOnTheSameRowColumnChecker = function(
  inRowOrColumn,
  indexCoordinate,
  lowerBound,
  upperBound,
  previouslyPlacedWordsData
) {
  let arrOfWordsToBeCheckedAgainst =
    previouslyPlacedWordsCoordinates[inRowOrColumn][indexCoordinate];
  if (arrOfWordsToBeCheckedAgainst.length === 0) {
    return true;
  }

  for (let i = 0; i < arrOfWordsToBeCheckedAgainst.length; ++i) {
    let wordCoordinatesToBeCheckedAgainst = arrOfWordsToBeCheckedAgainst[i];
    if (
      wordCoordinatesToBeCheckedAgainst[0] >= lowerBound &&
      wordCoordinatesToBeCheckedAgainst[0] <= upperBound
    ) {
      return false;
    }
  }
  return true;
};

const checkAgainstSpellCheckApi = function(word, database) {};

const checkAgainstDictionaryApiToGetDefAndPercentile = function(
  word,
  database
) {
  if (database.has(word)) {
    return database.get(word); ////// if true come out with the definition and determine the score that needs to be added
  } else {
    return "There is a problem between the info from SpellCheck API and the Dictionary API";
  }
};

const presentDefinitionToUser = function(def) {
  console.log(def);
};

const determineScore = function(word, percentile) {};

const gridDiffToExtractInfoAboutNewUserInputAndToPerformPreliminaryValidation = function(
  matrixOne,
  matrixTwo
) {
  let arrOfObjsWithInfo = [];
  arrOfObjsWithInfo.newLettersWord = "";
  let rowMap = new Map();
  let colMap = new Map();
  for (let row = 0; row < matrixOne.length; ++row) {
    for (let col = 0; col < matrixOne[row].length; ++col) {
      if (matrixOne[row][col] === matrixTwo[row][col]) {
        continue;
      }
      rowMap.set(row, true);
      colMap.set(col, true);
      //// check for words that have curvature, not fully kept in lines(i.e. row or a column)
      if (rowMap.size > 1 && colMap.size > 1) {
        return "Words need to be kept in a single row or column (i.e. no zig-zag)";
      }

      //// if you find a gap, check against previously placed words in the same row/column
      let previousItemInRowMap = getPreviousItemInMap(rowMap);
      let previousItemInColMap = getPreviousItemInMap(colMap);
      if (row - previousItemInRowMap > 1) {
        if (
          !wordsOnTheSameRowColumnChecker(
            "inCols",
            col,
            previousItemInRowMap + 1,
            row - 1,
            previouslyPlacedWordsCoordinates
          )
        ) {
          return "You cannot use letters from words placed on the same column";
        } else {
          ///// I need to fill the gaps with the info of previously placed letters - column word case
          for (
            let filling = previousItemInRowMap + 1;
            filling < row;
            ++filling
          ) {
            arrOfObjsWithInfo.push({
              letter: matrixOne[filling][col],
              row,
              col,
              surroundingEnvironmentClockwise:
                "none - letter from previously placed words"
            });
            arrOfObjsWithInfo.newLettersWord += matrixTwo[filling][col];
          }
          arrOfObjsWithInfo.direction = "down";
          arrOfObjsWithInfo.usedPreviouslyPlacedLetters = true;
        }
      } else if (col - previousItemInColMap > 1) {
        if (
          !wordsOnTheSameRowColumnChecker(
            "inRows",
            row,
            previousItemInColMap + 1,
            col - 1,
            previouslyPlacedWordsCoordinates
          )
        ) {
          return "You cannot use letters from words placed on the same row";
        } else {
          ///// I need to fill the gaps with the info of previously placed letters - row word case
          for (
            let filling = previousItemInColMap + 1;
            filling < col;
            ++filling
          ) {
            arrOfObjsWithInfo.push({
              letter: matrixOne[row][filling],
              row,
              col,
              surroundingEnvironmentClockwise:
                "none - letter from previously placed words"
            });
            arrOfObjsWithInfo.newLettersWord += matrixTwo[row][filling];
          }
          arrOfObjsWithInfo.direction = "right";
          arrOfObjsWithInfo.usedPreviouslyPlacedLetters = true;
        }
      }

      ///// build surrounding environment (array of booleans) and include it in the pushed object along with the other relevant info
      let surroundingEnvironmentClockwise = [
        matrixCellChecker(matrixTwo, row - 1, col),
        matrixCellChecker(matrixTwo, row, col + 1),
        matrixCellChecker(matrixTwo, row + 1, col),
        matrixCellChecker(matrixTwo, row, col - 1)
      ];
      arrOfObjsWithInfo.push({
        letter: matrixTwo[row][col],
        row,
        col,
        surroundingEnvironmentClockwise
      });
      arrOfObjsWithInfo.newLettersWord += matrixTwo[row][col];
    }
  }
  return arrOfObjsWithInfo;
};

let infoNewUI = gridDiffToExtractInfoAboutNewUserInputAndToPerformPreliminaryValidation(
  arrOne,
  arrTwo
);
console.log(infoNewUI);

/* What this function needs to do - take infoNewUI and 
  1. Check Spelling and Existence 
    If it exists send the "final" (spelt correctly), present to the user and determine score
    If not, go to 2.
  2. 
  
  verify that it either uses previously placed letters or is adjacent to them
  2. check spelling/existence using the APIs
    if they don't exists (i.e. not misspelled), look in the row/column for letters before/after them (i.e. look until you reach letters from words placed in the same row/column) =>
    if you find such letters, at each new letter try prepending/adding it to the current "main" and check for spelling and existence using the APIs again
  *!*!*!!* at some point you need to make sure the new word hasn't been already included
  3. check anagram/palindrome using the database 
      used to help you determine score*/

const something = function(arrOfObjsWithInfo) {
  let spellCheckInfo = checkAgainstSpellCheckApi(
    arrOfObjsWithInfo.newLettersWord,
    dummyDataSpellCheckAPI
  );
  let dictionaryInfo = checkAgainstDictionaryApiToGetDefAndPercentile(
    arrOfObjsWithInfo.newLettersWord,
    dummyDataDictionaryAPI
  );
  if (dictionaryInfo) {
    presentDefinitionToUser(dictionaryInfo.definition);
    determineScore(arrOfObjsWithInfo.newLettersWord, dictionaryInfo.percentile);
  } else {
    //// resolve problem between spellcheck and dictionaryAPI
  }

  let objWithInfo = arrOfObjsWithInfo.reduce(
    (acc, { letter, row, col, surroundingEnvironmentClockwise }, index) => {}
  );
};

console.log(something(infoNewUI));

/* this function might get large, so there is some benefit in modularization */
