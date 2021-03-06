import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import "./style.css";

class GridSpan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <span className="cells">{this.props.value}</span>;
  }
}

export default GridSpan;

/* we should have a checks on the user inputs - i.e. only english/latin characters are allowed, within certain charCode ranges */
