const createCorrectlySpeltWordObj = function(
  correctlySpeltWord,
  misspelledWordObj
) {
  return misspelledWordObj.direction === "down"
    ? {
        correctlySpeltWord,
        startingIndex: misspelledWordObj.startingRow,
        endingIndex: misspelledWordObj.endingRow,
        fixedIndex: misspelledWordObj.col,
        direction: "down"
      }
    : {
        correctlySpeltWord,
        startingIndex: misspelledWordObj.startingCol,
        endingIndex: misspelledWordObj.endingCol,
        fixedIndex: misspelledWordObj.row,
        direction: "right"
      };
};

const checkIfTheCorrectlySpeltWordFitsTheGrid = function(
  correctlySpeltWordObj,
  grid,
  callbackForCellChecker,
  callbackForCellEmptyChecker
) {
  let word = correctlySpeltWordObj.correctlySpeltWord;
  let wordLength = word.length;
  let startIndexInGrid = correctlySpeltWordObj.startingIndex;
  let fixedIndexInGrid = correctlySpeltWordObj.fixedIndex;

  for (let i = 0; i < wordLength; ++i) {
    if (correctlySpeltWordObj.direction === "down") {
      if (
        callbackForCellChecker(grid, startIndexInGrid + i, fixedIndexInGrid) &&
        (callbackForCellEmptyChecker(
          grid,
          startIndexInGrid + i,
          fixedIndexInGrid
        ) ||
          word.charAt(i) === grid[startIndexInGrid + i][fixedIndexInGrid])
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        callbackForCellChecker(grid, startIndexInGrid + i, fixedIndexInGrid) &&
        (callbackForCellEmptyChecker(
          grid,
          startIndexInGrid + i,
          fixedIndexInGrid
        ) ||
          word.charAt(i) === grid[fixedIndexInGrid][startIndexInGrid + i])
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};

const addOneLetterAtEnd = function(
  wordObj,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord = wordObj.word + String.fromCharCode(i);
    if (dictionary.hasOwnProperty(newWord)) {
      let correctlySpeltWordObj = createCorrectlySpeltWordObj(newWord, wordObj);
      correctlySpeltWordObj.endingIndex++;
      if (
        checkIfTheCorrectlySpeltWordFitsTheGrid(
          correctlySpeltWordObj,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      )
        arrOfNewWords.push(newWord);
    }
  }
  return arrOfNewWords;
};

const addOneLetterGeneric = function(
  wordObj,
  index,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord =
      wordObj.word.substring(-Infinity, index) +
      String.fromCharCode(i) +
      wordObj.word.substring(index, wordObj.word.length);
    if (dictionary.hasOwnProperty(newWord)) {
      let correctlySpeltWordObj = createCorrectlySpeltWordObj(newWord, wordObj);
      if (index === 0) {
        correctlySpeltWordObj.startingIndex++;
      } else {
        correctlySpeltWordObj.endingIndex++;
      }
      if (
        checkIfTheCorrectlySpeltWordFitsTheGrid(
          correctlySpeltWordObj,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      ) {
        arrOfNewWords.push(newWord);
      }
    }
  }

  return arrOfNewWords;
};

const removeOneLetter = function(
  wordObj,
  index,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfNewWords = [];
  let newWord =
    wordObj.word.substring(-Infinity, index) +
    wordObj.word.substring(index + 1, wordObj.word.length);
  if (dictionary.hasOwnProperty(newWord)) {
    let correctlySpeltWordObj = createCorrectlySpeltWordObj(newWord, wordObj);
    if (index === 0) {
      correctlySpeltWordObj.startingIndex--;
    } else {
      correctlySpeltWordObj.endingIndex--;
    }
    if (
      checkIfTheCorrectlySpeltWordFitsTheGrid(
        correctlySpeltWordObj,
        grid,
        callbackForCellChecker,
        callbackForEmptyCellChecker
      )
    ) {
      arrOfNewWords.push(newWord);
    }
  }
  return arrOfNewWords;
};

const oneLetterSubstitution = function(
  wordObj,
  index,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord =
      wordObj.word.substring(-Infinity, index) +
      String.fromCharCode(i) +
      wordObj.word.substring(index + 1, wordObj.word.length);

    if (dictionary.hasOwnProperty(newWord)) {
      let correctlySpeltWordObj = createCorrectlySpeltWordObj(newWord, wordObj);

      if (
        checkIfTheCorrectlySpeltWordFitsTheGrid(
          correctlySpeltWordObj,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      ) {
        arrOfNewWords.push(newWord);
      }
    }
  }
  return arrOfNewWords;
};

const swappingAdjacentLetters = function(
  wordObj,
  index,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfNewWords = [];
  let newWord =
    wordObj.word.substring(0, index) +
    wordObj.word.charAt(index + 1) +
    wordObj.word.charAt(index) +
    wordObj.word.substring(index + 2, wordObj.word.length);
  if (dictionary.hasOwnProperty(newWord)) {
    let correctlySpeltWordObj = createCorrectlySpeltWordObj(newWord, wordObj);

    if (
      checkIfTheCorrectlySpeltWordFitsTheGrid(
        correctlySpeltWordObj,
        grid,
        callbackForCellChecker,
        callbackForEmptyCellChecker
      )
    ) {
      arrOfNewWords.push(newWord);
    }
  }
  return arrOfNewWords;
};

const simpleWrongSpellingPotentialWords = function(
  arrOfObjectsWithPossibleWords,
  dictionary,
  grid,
  callbackForCellChecker,
  callbackForEmptyCellChecker
) {
  let arrOfOptions = [];

  for (let i = 0; i < arrOfObjectsWithPossibleWords.length; ++i) {
    let misspelledWord = arrOfObjectsWithPossibleWords[i].word;
    let misspelledWordObj = arrOfObjectsWithPossibleWords[i];
    if (misspelledWord.length <= 2) {
      continue;
    }

    arrOfOptions.push(
      ...addOneLetterAtEnd(
        misspelledWordObj,
        dictionary,
        grid,
        callbackForCellChecker,
        callbackForEmptyCellChecker
      )
    );

    for (let i = 0; i < misspelledWord.length; ++i) {
      if (
        i !== misspelledWord.length - 1 &&
        misspelledWord.charAt(i) !== misspelledWord.charAt(i + 1)
      ) {
        arrOfOptions.push(
          ...swappingAdjacentLetters(
            misspelledWordObj,
            i,
            dictionary,
            grid,
            callbackForCellChecker,
            callbackForEmptyCellChecker
          )
        );
      }
      arrOfOptions.push(
        ...addOneLetterGeneric(
          misspelledWordObj,
          i,
          dictionary,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      );
      arrOfOptions.push(
        ...removeOneLetter(
          misspelledWordObj,
          i,
          dictionary,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      );
      arrOfOptions.push(
        ...oneLetterSubstitution(
          misspelledWordObj,
          i,
          dictionary,
          grid,
          callbackForCellChecker,
          callbackForEmptyCellChecker
        )
      );
    }
  }

  return new Set(arrOfOptions);
};

exports.simpleWrongSpellingPotentialWords = simpleWrongSpellingPotentialWords;
