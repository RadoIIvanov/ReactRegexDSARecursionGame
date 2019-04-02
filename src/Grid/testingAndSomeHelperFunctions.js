let determineLetterScore = require("../../databaseSetUpAndBackUpDataFiles/helperFunctionality")
  .determineLetterScore;
let fs = require("fs");
let simpleWrongSpellingPotentialWords = require("../../ownSpellChecker/spellcheckerFunctionality")
  .simpleWrongSpellingPotentialWords;

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
  ["", "", "", "a", ""],
  ["", "", "", "l", ""],
  ["", "", "", "", ""],
  ["a", "b", "p", "", ""],
  ["", "", "d", "g", "i"],
  ["", "l", "e", "", ""],
  ["", "", "", "t", ""],
  ["", "", "", "y", "b"],
  ["", "", "", "d", "z"]
];
let arrTwo = [
  ["", "", "", "a", ""],
  ["", "", "", "l", ""],
  ["", "", "", "m", ""],
  ["a", "b", "p", "e", ""],
  ["", "", "d", "g", "i"],
  ["", "l", "e", "h", ""],
  ["", "", "", "t", ""],
  ["", "", "", "y", "b"],
  ["", "", "", "d", "z"]
];

let previouslyPlacedWordsCoordinates = {
  inRows: [
    [],
    [],
    [],
    [[0, 2]],
    [[2, 4]],
    [[1, 2]],
    [[3, 3]],
    [[3, 4]],
    [[3, 4]]
  ],
  inCols: [[], [], [[3, 5]], [[8, 8]], []]
};

let dummyDataDictionaryAPI = new Map();
dummyDataDictionaryAPI.set("almighty", {
  percentile: 0.3,
  definition: "having complete power; omnipotent"
});
dummyDataDictionaryAPI.set("might", {
  percentile: 0.5,
  definition: "incredible strength"
});

let dummyDataSpellCheckAPI = new Map();
dummyDataSpellCheckAPI.set(
  ["almight", "amighty", "almihty", "almihgy"],
  "almighty"
);
//// we will have to check how things work when words can have multiple main definition (i.e. might as the p.p of the verb may, and might as a noun)

/* naive way - as we go along we can perform preliminary checks, extract letter, coordinates, and surrounding letters
  and return an array of objects*/

const matrixCellChecker = function(matrix, row, col) {
  if (matrix[row] && matrix[row][col] !== undefined) {
    return true;
  } else {
    return false;
  }
};

const matrixCellEmptyChecker = function(matrix, row, col) {
  if (matrix[row][col] === "") {
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

const checkForAdjacency = function(objWithPreliminaryData) {
  return objWithPreliminaryData.some(
    ({ surroundingEnvironmentClockwise }, index) => {
      if (objWithPreliminaryData.direction === "down") {
        if (index === 0) {
          return (
            surroundingEnvironmentClockwise[0] ||
            surroundingEnvironmentClockwise[1] ||
            surroundingEnvironmentClockwise[3]
          );
        } else if (index === objWithPreliminaryData.length - 1) {
          return (
            surroundingEnvironmentClockwise[1] ||
            surroundingEnvironmentClockwise[2] ||
            surroundingEnvironmentClockwise[3]
          );
        } else {
          return (
            surroundingEnvironmentClockwise[1] ||
            surroundingEnvironmentClockwise[3]
          );
        }
      }

      if (objWithPreliminaryData.direction === "right") {
        if (index === 0) {
          return (
            surroundingEnvironmentClockwise[0] ||
            surroundingEnvironmentClockwise[2] ||
            surroundingEnvironmentClockwise[3]
          );
        } else if (index === objWithPreliminaryData.length - 1) {
          return (
            surroundingEnvironmentClockwise[0] ||
            surroundingEnvironmentClockwise[1] ||
            surroundingEnvironmentClockwise[2]
          );
        } else {
          return (
            surroundingEnvironmentClockwise[0] ||
            surroundingEnvironmentClockwise[2]
          );
        }
      }
    }
  );
};

const checkToSeeIfYouCanDetermineTheMisspeltWordWithConfidence = function(
  dictionary,
  arrOfPossibilities
) {
  let arrOfObjsOfValidWords = [...arrOfPossibilities.entries()]
    .reduce((acc, [word]) => {
      if (dictionary.hasOwnProperty(word)) {
        let tempObj = {
          word,
          score: dictionary[word].score,
          percentile: dictionary[word].percentile
        };
        acc.push(tempObj);
      }
      return acc;
    }, [])
    .sort(({ percentile: percentileA }, { percentile: percentileB }) => {
      if (percentileA > percentileB) {
        return -1;
      } else {
        return 1;
      }
    });
  if (arrOfObjsOfValidWords.length === 0) {
    return `The word doesn't exist. You automatically skip the turn.`;
  }
  if (
    !arrOfObjsOfValidWords[1] ||
    arrOfObjsOfValidWords[0].percentile - arrOfObjsOfValidWords[1].percentile >=
      0.05
  ) {
    return arrOfObjsOfValidWords[0];
  } else {
    return `The word seems to exist but you have misspelled it significantly enough to prevent us from determining it exactly`;
  }
};

const checkAgainstDictionaryApiToGetDefAndPercentile = function(
  ///// this function is not complete
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
  //// this function is not complete
  console.log(def);
};

const determineScore = function(word, percentile) {
  let letterScore = determineLetterScore(word);
  if (percentile > 0.5) {
    return letterScore + (0.5 - percentile) * letterScore;
  } else if (percentile < 0.5) {
    return letterScore + (0.5 - percentile) * 2 * letterScore;
  } else {
    return letterScore;
  }
};

const addPrefixSuffixToWordAndDetermineOptions = function(
  prefix,
  suffix,
  objWithInfo
) {
  let somePrefixReversed = prefix
    .split("")
    .reverse()
    .join("");

  let arrOfOptions = [];

  let originalCopied = objWithInfo.newLettersWord;

  if (objWithInfo.direction === "down") {
    for (let i = -1; i < somePrefixReversed.length; ++i) {
      originalCopied =
        originalCopied.substring(0, i) +
        somePrefixReversed.charAt(i) +
        originalCopied.substring(i, originalCopied.length);
      let startingRow = objWithInfo[0].row - (i + 1);

      let originalCopiedCopied = originalCopied;
      for (let j = -1; j < suffix.length; ++j) {
        originalCopiedCopied += suffix.charAt(j);
        let endingRow = objWithInfo[objWithInfo.length - 1].row + (j + 1);

        arrOfOptions.push({
          word: originalCopiedCopied,
          startingRow,
          endingRow,
          col: objWithInfo[0].col,
          direction: "down"
        });
      }
    }
  } else if (objWithInfo.direction === "right") {
    for (let i = -1; i < somePrefixReversed.length; ++i) {
      originalCopied =
        originalCopied.substring(0, i) +
        somePrefixReversed.charAt(i) +
        originalCopied.substring(i, originalCopied.length);
      let startingCol = objWithInfo[0].col - (i + 1);

      let originalCopiedCopied = originalCopied;
      for (let j = -1; j < suffix.length; ++j) {
        originalCopiedCopied += suffix.charAt(j);
        let endingCol = objWithInfo[objWithInfo.length - 1].col + (j + 1);

        arrOfOptions.push({
          word: originalCopiedCopied,
          startingCol,
          endingCol,
          row: objWithInfo[0].row,
          direction: "right"
        });
      }
    }
  }

  return arrOfOptions;
};

const determineAffix = function(
  objWithInfo,
  previouslyPlacedWordsCoordinates,
  matrixOne,
  increment
) {
  let affix = "";

  if (objWithInfo.direction === "down") {
    let rowIndex =
      objWithInfo[increment < 0 ? 0 : objWithInfo.length - 1].row + increment;
    let colIndex = objWithInfo[0].col;
    while (true) {
      if (
        !(
          matrixCellChecker(matrixOne, rowIndex, colIndex) &&
          !matrixCellEmptyChecker(matrixOne, rowIndex, colIndex)
        )
      ) {
        break;
      }
      if (
        previouslyPlacedWordsCoordinates["inCols"][colIndex].length !== 0 &&
        previouslyPlacedWordsCoordinates["inCols"][colIndex].some(
          ([lowerBound, upperBound]) => {
            if (rowIndex === upperBound) {
              return true;
            }
          }
        )
      ) {
        break;
      }
      affix += matrixOne[rowIndex][colIndex];
      rowIndex += increment;
    }
  }

  if (objWithInfo.direction === "right") {
    let rowIndex = objWithInfo[0].row;
    let colIndex =
      objWithInfo[increment < 0 ? 0 : objWithInfo.length - 1].col + increment;
    while (true) {
      if (
        !(
          matrixCellChecker(matrixOne, rowIndex, colIndex) &&
          !matrixCellEmptyChecker(matrixOne, rowIndex, colIndex)
        )
      ) {
        break;
      }
      if (
        previouslyPlacedWordsCoordinates["inRows"][rowIndex].length !== 0 &&
        previouslyPlacedWordsCoordinates["inRows"][rowIndex].some(
          ([lowerBound, upperBound]) => {
            if (colIndex === upperBound) {
              return true;
            }
          }
        )
      ) {
        break;
      }
      affix += matrixOne[rowIndex][colIndex];
      rowIndex += increment;
    }
  }
  /* conditions for stopping the while loop, 1. matrix cell checker is false, 2. matrix cell empty checker is false, 3. you've reached a word in the same row/col  */

  return affix;
};

/* the function below checks if the new word is validly placed on the grid (1. checks for zig-zag, 2. checks if it uses letters from words placed on the same row/column)
3. provides info on a) whether it uses previously placed words and b) the surrounding environment to check if any of the letters are adjacent to previously placed ones  */

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
              row: filling,
              col,
              surroundingEnvironmentClockwise: false
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
              col: filling,
              surroundingEnvironmentClockwise: false
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

/* the function below does the following :
1. check the word against the database
  a) if it exists => 1. check for adjacency/used letters from PPW, 2. if the condition in 1 is satisfied as well, send to the dictionary API for definition and score  
  b) if it doesn't => check the surrounding environment (check in the appropriate rows/columns, before and after ), if you find letters, determine possible affixes
  and generate main word possibilities (i.e. the break condition is if you reach letters from words placed in the same row/column), check the possibilities against
  dictionary. If you don't find anything, generate the potential misspellings of each of the possibilities, check them against dictionary and check if you can
  determine the misspelled word with confidence. If you can, send it to the dictionary API, if you cannot return a response 
  (i.e. "no such word", "don't try to guess", "cannot determine it with confidence etc") ) */

const determineFinalValidityScoreDefinition = function(arrOfObjsWithInfo) {
  new Promise((resolve, reject) => {
    fs.readFile(
      "../../databaseSetUpAndBackUpDataFiles/backupDataFile.json",
      "utf8",
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  })
    .then(data => {
      let objWithData = JSON.parse(data);
      if (objWithData.hasOwnProperty(arrOfObjsWithInfo.newLettersWord)) {
        if (
          arrOfObjsWithInfo.usedPreviouslyPlacedLetters ||
          checkForAdjacency(arrOfObjsWithInfo)
        ) {
          let APIData = checkAgainstDictionaryApiToGetDefAndPercentile(
            arrOfObjsWithInfo.newLettersWord,
            dummyDataDictionaryAPI
          );
          if (typeof APIData === "object") {
            return {
              score: determineScore(
                arrOfObjsWithInfo.newLettersWord,
                APIData.percentile
              ),
              definition: APIData.definition
            };
          } else {
            return APIData;
          }
        } else {
          return `Your word neither uses any previously placed letters, nor is adjacent to any of them`;
        }
      } else {
        let arrOfOtherPossibleMainWords = addPrefixSuffixToWordAndDetermineOptions(
          determineAffix(
            arrOfObjsWithInfo,
            previouslyPlacedWordsCoordinates,
            arrOne,
            -1
          ),
          determineAffix(
            arrOfObjsWithInfo,
            previouslyPlacedWordsCoordinates,
            arrOne,
            +1
          ),
          arrOfObjsWithInfo
        );
        for (let i = 0; i < arrOfOtherPossibleMainWords.length; ++i) {
          if (objWithData.hasOwnProperty(arrOfOtherPossibleMainWords[i].word)) {
            let APIDataOption = checkAgainstDictionaryApiToGetDefAndPercentile(
              arrOfOtherPossibleMainWords[i].word,
              dummyDataDictionaryAPI
            );
            if (typeof APIDataOption === "object") {
              return {
                word: arrOfOtherPossibleMainWords[i].word,
                score: determineScore(
                  arrOfOtherPossibleMainWords[i].word,
                  APIDataOption.percentile
                ),
                definition: APIDataOption.definition
              };
            }
          }
        }

        //// check for misspellings
        return checkToSeeIfYouCanDetermineTheMisspeltWordWithConfidence(
          objWithData,
          simpleWrongSpellingPotentialWords(
            arrOfOtherPossibleMainWords,
            objWithData,
            arrOne,
            matrixCellChecker,
            matrixCellEmptyChecker
          )
        );
      }
    })
    .then(console.log);
};

determineFinalValidityScoreDefinition(infoNewUI);

/* this function might get large, so there is some benefit in modularization */
