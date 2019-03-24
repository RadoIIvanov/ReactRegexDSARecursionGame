import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import GridRows from "./GridRows";
import "./style.css";

class Grid extends Component {
  constructor(props) {
    super(props);
    this.matrix = [[1, "0", 3], [4, 5, "0"], ["0", 8, 9]];
  }

  render() {
    let arr = Array.from({ length: this.props.size }, (element, index) => (
      <GridRows rowNumber={index} value={this.matrix[index]} />
    ));

    return <div className="wrapper">{arr}</div>;
  }
}

export default Grid;
