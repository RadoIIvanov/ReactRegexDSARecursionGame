const fs = require("fs");
const { determineLetterScore } = require("./helperFunctionality");

const readableStream = fs.createReadStream("./sowpodsWords.txt", {
  encoding: "utf-8"
});

let buffer = ""; //// temp storage

module.exports = new Promise(resolve => {
  let mapDictionary = new Map();
  (function() {
    readableStream.on("data", function(chunk) {
      readableStream.pause();
      buffer += chunk.toString().toLowerCase();
      processTheBuffer();
      readableStream.resume();
    });

    const processTheBuffer = function() {
      let positionOfFirstNewLine;
      while ((positionOfFirstNewLine = buffer.indexOf("\n")) >= 0) {
        //// execute until new lines are present in the buffer
        sendForFurtherProcessing(buffer.slice(0, positionOfFirstNewLine));
        buffer = buffer.slice(positionOfFirstNewLine + 1);
      }
    };

    const sendForFurtherProcessing = function(word) {
      if (word.charAt(word.length - 1) === "\r") {
        word = word.substring(0, word.length - 1);
      }
      let score = determineLetterScore(word);
      mapDictionary.set(word, score);
    };

    readableStream.on("end", function() {
      console.log("there is no more data from sowpods Stream");
      resolve(mapDictionary);
    });
  })();
});
