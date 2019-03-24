//// this is the top stateful parent component

import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import Grid from "./Grid/Grid";

class GameOuterStructure extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid size={this.props.size} />
      </div>
    );
  }
}

ReactDOM.render(
  <GameOuterStructure size={32} />,
  document.getElementById("root")
);
