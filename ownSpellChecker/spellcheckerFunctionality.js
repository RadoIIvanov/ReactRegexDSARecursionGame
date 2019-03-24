let someWord = "zzzzz";

const addOneLetterAtEnd = function(word) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord = word + String.fromCharCode(i);
    arrOfNewWords.push(newWord);
  }
  return arrOfNewWords;
};

const addOneLetterGeneric = function(word, index) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord =
      word.substring(-Infinity, index) +
      String.fromCharCode(i) +
      word.substring(index, word.length);
    arrOfNewWords.push(newWord);
  }

  return arrOfNewWords;
};

const removeOneLetter = function(word, index) {
  return (
    word.substring(-Infinity, index) + word.substring(index + 1, word.length)
  );
};

const oneLetterSubstitution = function(word, index) {
  let arrOfNewWords = [];
  for (let i = 97; i < 123; ++i) {
    let newWord =
      word.substring(-Infinity, index) +
      String.fromCharCode(i) +
      word.substring(index + 1, word.length);
    arrOfNewWords.push(newWord);
  }
  return arrOfNewWords;
};

const swappingAdjacentLetters = function(word, index) {
  return (
    word.substring(0, index) +
    word.charAt(index + 1) +
    word.charAt(index) +
    word.substring(index + 2, word.length)
  );
};

const simpleWrongSpellingPotentialWords = function(misspelledWord) {
  if (misspelledWord.length <= 2) {
    return `Don't try to guess. You automatically skip the turn.`;
  }

  let arrOfOptions = [];

  arrOfOptions.push(...addOneLetterAtEnd(misspelledWord));

  for (let i = 0; i < misspelledWord.length; ++i) {
    if (
      i !== misspelledWord.length - 1 &&
      misspelledWord.charAt(i) !== misspelledWord.charAt(i + 1)
    ) {
      arrOfOptions.push(swappingAdjacentLetters(misspelledWord, i));
    }
    arrOfOptions.push(...addOneLetterGeneric(misspelledWord, i));
    arrOfOptions.push(removeOneLetter(misspelledWord, i));
    arrOfOptions.push(...oneLetterSubstitution(misspelledWord, i));
  }

  return new Set(arrOfOptions);
};

exports.arrOfOptions = simpleWrongSpellingPotentialWords(someWord);
