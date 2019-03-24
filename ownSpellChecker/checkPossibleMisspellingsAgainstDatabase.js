let arrOfOptions = require("./spellcheckerFunctionality").arrOfOptions;
let fs = require("fs");

fs.readFile(
  "../databaseSetUpAndBackUpDataFiles/backupDataFile.json",
  "utf8",
  function(err, data) {
    if (err) {
      console.log(err);
    } else {
      let objOfData = JSON.parse(data);
      let arrOfObjsOfValidWords = [...arrOfOptions.entries()]
        .reduce((acc, [word]) => {
          if (objOfData.hasOwnProperty(word)) {
            let tempObj = {
              word,
              score: objOfData[word].score,
              percentile: objOfData[word].percentile
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
        arrOfObjsOfValidWords[0].percentile -
          arrOfObjsOfValidWords[1].percentile >=
        0.05
      ) {
        return arrOfObjsOfValidWords[0]; ///// along with some comment
      }
    }
  }
);
