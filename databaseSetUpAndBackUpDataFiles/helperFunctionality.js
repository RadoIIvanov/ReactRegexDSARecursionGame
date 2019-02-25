const objLetterScore = {
  e: 1,
  a: 1,
  i: 1,
  o: 1,
  n: 1,
  r: 1,
  t: 1,
  l: 1,
  s: 1,
  u: 1,
  d: 2,
  g: 2,
  b: 3,
  c: 3,
  m: 3,
  p: 3,
  f: 4,
  h: 4,
  v: 4,
  w: 4,
  y: 4,
  k: 5,
  j: 8,
  x: 8,
  q: 10,
  z: 10
};

exports.objLetterScore = objLetterScore;

const determineLetterScore = function(str) {
  let length = str.length;
  let score = 0;
  for (let i = 0; i < length; ++i) {
    score += objLetterScore[str[i]];
  }
  return score;
};

exports.determineLetterScore = determineLetterScore;

function palindromeChecker(str) {
  let alphaNumericVersionOfStr = str.replace(/\W|_/g, "").toLowerCase();

  for (let i = 0, j = alphaNumericVersionOfStr.length - 1; i <= j; ++i, --j) {
    if (
      alphaNumericVersionOfStr.charAt(i) !== alphaNumericVersionOfStr.charAt(j)
    ) {
      return false;
    }
  }
  return true;
}

exports.palindromeChecker = palindromeChecker;

const anagramChecker = function(subject, anagram) {
  let subjectLength = subject.length;
  let anagramLength = anagram.length;

  if (subjectLength !== anagramLength) {
    return false;
  }

  let objSubject = {};
  let objAnagram = {};

  for (let i = 0; i < subjectLength; ++i) {
    if (objSubject.hasOwnProperty(subject.charAt(i))) {
      objSubject[subject.charAt(i)] += 1;
    } else {
      objSubject[subject.charAt(i)] = 1;
    }

    if (objAnagram.hasOwnProperty(anagram.charAt(i))) {
      objAnagram[anagram.charAt(i)] += 1;
    } else {
      objAnagram[anagram.charAt(i)] = 1;
    }
  }

  for (let letter in objSubject) {
    if (
      !objAnagram.hasOwnProperty(letter) ||
      objAnagram[letter] !== objSubject[letter]
    ) {
      return false;
    }
  }
  return true;
};

exports.anagramChecker = anagramChecker;

const createAMapofAnagramsFromDictionary = function(dictionary) {
  let mapOfAnagrams = new Map();
  let iterable = dictionary.keys();
  let currentWord = "";
  while ((currentWord = iterable.next().value)) {
    let sortedWord = currentWord
      .split("")
      .sort()
      .join("");
    if (mapOfAnagrams.has(sortedWord)) {
      mapOfAnagrams.get(sortedWord).push(currentWord);
    } else {
      mapOfAnagrams.set(sortedWord, []);
      mapOfAnagrams.get(sortedWord).push(currentWord);
    }
  }
  return mapOfAnagrams;
};

const addAnagramsAndPalindromesToDictionary = function(dictionary) {
  let mapOfAnagrams = createAMapofAnagramsFromDictionary(dictionary);
  return new Map(
    [...dictionary.entries()].reduce((acc, [word, { score, percentile }]) => {
      let sortedWord = word
        .split("")
        .sort()
        .join("");
      let smallArrToPushInAcc = [];
      let objToPushInSmallArr = {
        score,
        percentile,
        anagrams: mapOfAnagrams.get(sortedWord),
        palindromeFlag: palindromeChecker(word)
      };

      smallArrToPushInAcc.push(word);
      smallArrToPushInAcc.push(objToPushInSmallArr);
      acc.push(smallArrToPushInAcc);
      return acc;
    }, [])
  );
};

exports.addAnagramsAndPalindromesToDictionary = addAnagramsAndPalindromesToDictionary;

// importedCombinedPromise.then(function(data) {
//   let arr = [];
//   let iterator = data.keys();
//   let currentKey = "";
//   while ((currentKey = iterator.next().value)) {
//     if (palindrome(currentKey)) {
//       arr.push(currentKey);
//     }
//   }
//   console.log(arr.length);
//   console.log(arr);
// });
