//// need to take into account milliseconds!!!
let objOfDummyDataOne = {
  clockTimePlayerOne: 1000,
  clockTimePlayerTwo: 1500,
  playerTurn: "P2",
  playerOneScore: 15.32,
  playerTwoScore: 25.76,
  playerOneTools: { hints: 7, restrictLocation: 3, restrictLetters: 6 },
  playerTwoTools: { hints: 4, restrictLocation: 7, restrictLetters: 2 },
  wordGridSize: { rows: 32, columns: 32 },
  words: [
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
  ]
};

console.log(objOfDummyDataOne);
/// first word needs to be either in the middle row if it is a horizontal word, or a middle column => it will be automatically centered
/// the above can potentially be used for the creation of annotation boxes
/// different bits and pieces of this information will be distribute to the children that need it (i.e. determine a player's score)
/// I need to have 1. the coordinates of each word, 2. who played it, 3. in what order they were played
///

// let objOfDummyDataTwo = {
//   clockTimePlayerOne: 1000,
//   clockTimePlayerTwo: 1500,
//   playerTurn: "P2",
//   playerOneScore: 15.32,
//   playerTwoScore: 25.76,
//   playerOneTools: { hints: 7, restrictLocation: 3, restrictLetters: 6 },
//   playerTwoTools: { hints: 4, restrictLocation: 7, restrictLetters: 2 },
//   wordGridSize: { rows: 32, columns: 32 },
//   words: { playerOne: {}, playerTwo: {} }
// };
