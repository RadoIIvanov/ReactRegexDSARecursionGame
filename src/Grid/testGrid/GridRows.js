import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import GridSpan from "./GridSpan";
import "./style.css";

class GridRows extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let arr = Array.from(
      { length: this.props.value.length },
      (element, index) => {
        return (
          <GridSpan columnNumber={index} value={this.props.value[index]} />
        );
      }
    );

    return <div className="nestedWrapper">{arr}</div>;
  }
}

export default GridRows;
