import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import GridDiv from "./GridDiv";
import "./style.css";
const { buildSquareMatrix } = require("./helperFunctionality");
const { populateSquareMatrix } = require("./helperFunctionality");

/*
Each cell of the grid is a textbox
1. the function needs to take parameters (i.e. grid dimensions, )
2. the function needs to ask for help from the generic cell/textbox creator
what about population of the grid, each receiving words and sending them to the textbox children to represent them on the screen 
    {
      word: "knowledgeable",
      startingSquare: { row: 16, column: 9 },
      direction: "r"
    }

indexes need to be fixed

*/

class Grid extends Component {
  constructor(props) {
    super(props);
    this.size = props.size;
    this.objOfDummyData = [
      {
        wordOne: "knowledgeable",
        startingSquare: { row: 16, column: 9 },
        direction: "r",
        player: "P2"
      },
      {
        wordOne: "racecar",
        startingSquare: { row: 15, column: 18 },
        direction: "d",
        player: "P1"
      },
      {
        wordOne: "listen",
        startingSquare: { row: 12, column: 14 },
        direction: "d",
        player: "P2"
      },
      {
        wordOne: "silent",
        startingSquare: { row: 14, column: 14 },
        direction: "r",
        player: "P1"
      }
    ];
    this.gridMatrix = populateSquareMatrix(
      buildSquareMatrix(this.size),
      this.objOfDummyData
    );
  }

  render() {
    let arr = Array.from({ length: this.size }, (value, index) => (
      <GridDiv rowNumber={index + 1} value={this.gridMatrix[index]} />
    ));
    return <div className="wrapper">{arr}</div>;
  }
}

export default Grid;
