import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import GridSpan from "./GridSpan";
import "./style.css";

class GridDiv extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let arr = Array.from(
      { length: this.props.value.length },
      (value, index) => (
        <GridSpan columnNumber={index + 1} value={this.props.value[index]} />
      )
    );
    return <div className="nestedWrapper">{arr}</div>;
  }
}

export default GridDiv;
