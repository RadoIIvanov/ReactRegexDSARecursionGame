const completeMap = require("./addAnagramsAndPalindromesToMap");
const fs = require("fs");

completeMap.then(function(dataToBeWritten) {
  let objToGetTheMapData = {};
  let iterator = dataToBeWritten.entries();
  let currentEntry = "";
  while ((currentEntry = iterator.next().value)) {
    objToGetTheMapData[currentEntry[0]] = currentEntry[1];
  }

  fs.writeFile(
    "backupDataFile.json",
    JSON.stringify(objToGetTheMapData, null, 2),
    function(err, objToGetTheMapData) {
      if (err) {
        console.log(err);
      } else {
        console.log(`success!!`);
      }
    }
  );
});
