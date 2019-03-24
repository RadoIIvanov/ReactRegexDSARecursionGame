const validWordsWithScores = require("./getInfoFromSowpodsFile");
const fs = require("fs");

module.exports = validWordsWithScores.then(mapWithScores => {
  return new Promise(resolve => {
    let intermediateStructureObj = {};
    let counterForInterimObj = 0;

    const createReadableStream = fs.createReadStream(
      "./wordsNGramFrequency.txt",
      { encoding: "utf-8" }
    );

    let buffer = "";

    createReadableStream.on("data", function(chunk) {
      createReadableStream.pause();
      buffer += chunk.toString().toLowerCase();
      processTheBuffer();
      createReadableStream.resume();
    });

    const processTheBuffer = function() {
      let positionOfTheFirstNewLine;

      while ((positionOfTheFirstNewLine = buffer.indexOf("\n")) >= 0) {
        extractWordAndStoreInObj(
          buffer.substring(0, positionOfTheFirstNewLine)
        );
        buffer = buffer.substring(positionOfTheFirstNewLine + 1);
      }
    };

    const extractWordAndStoreInObj = function(str) {
      if (str.charAt(str.length - 1) === "\r") {
        str = str.substring(0, str.length - 1);
      }
      let tempArr = str.split("\t");
      intermediateStructureObj[tempArr[0]] = ++counterForInterimObj;
    };

    createReadableStream.on("end", function() {
      console.log("there is no more data from the nGramFrequency Stream");
      let lengthOfInterimObj = Object.keys(intermediateStructureObj).length;

      let combinedMap = new Map(
        [...mapWithScores.entries()].reduce((acc, [word, score]) => {
          let smallArrToPushInAcc = [];
          let objToPushInSmallArr = {
            score,
            percentile: intermediateStructureObj[word]
              ? Math.round(
                  100 *
                    (1 - intermediateStructureObj[word] / lengthOfInterimObj)
                ) / 100
              : 0.01
          };
          smallArrToPushInAcc.push(word);
          smallArrToPushInAcc.push(objToPushInSmallArr);
          acc.push(smallArrToPushInAcc);
          return acc;
        }, [])
      );
      resolve(combinedMap);
    });
  });
});
