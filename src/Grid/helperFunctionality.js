/* (probably a class for the matrix alonside a few methods would work well) */
const buildSquareMatrix = function(n) {
  let arr = [];

  for (let row = 0; row < n; ++row) {
    let rowArr = [];
    for (let col = 0; col < n; ++col) {
      rowArr.push("");
    }
    arr.push(rowArr);
  }
  return arr;
};

exports.buildSquareMatrix = buildSquareMatrix;

let dummyData = [
  {
    wordOne: "knowledgeable",
    startingSquare: { row: 16, column: 9 },
    direction: "r",
    player: "P2"
  },
  {
    wordOne: "racecar",
    startingSquare: { row: 15, column: 19 },
    direction: "d",
    player: "P1"
  },
  {
    wordOne: "listen",
    startingSquare: { row: 12, column: 15 },
    direction: "d",
    player: "P2"
  },
  {
    wordOne: "silent",
    startingSquare: { row: 13, column: 14 },
    direction: "r",
    player: "P1"
  }
];

//// this needs to be re-rewritten, also the indexes of the dummy data/react need to be fixed (probably a class for the matrix alonside a few methods would work well)
const populateSquareMatrix = function(matrix, arrOfObjOfData) {
  arrOfObjOfData.forEach(objOfData => {
    if (objOfData.direction === "r") {
      for (let i = 0; i < objOfData.wordOne.length; ++i) {
        if (
          !matrix[objOfData.startingSquare.row][
            objOfData.startingSquare.column + i
          ]
        ) {
          matrix[objOfData.startingSquare.row][
            objOfData.startingSquare.column + i
          ] = objOfData.wordOne.charAt(i);
        }
      }
    } else if (objOfData.direction === "d") {
      for (let i = 0; i < objOfData.wordOne.length; ++i) {
        if (
          !matrix[objOfData.startingSquare.row + i][
            objOfData.startingSquare.column
          ]
        ) {
          matrix[objOfData.startingSquare.row + i][
            objOfData.startingSquare.column
          ] = objOfData.wordOne.charAt(i);
        }
      }
    }
  });

  return matrix;
};

exports.populateSquareMatrix = populateSquareMatrix;

console.log(populateSquareMatrix(buildSquareMatrix(32), dummyData));
