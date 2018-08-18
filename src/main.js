import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputImages: [],
      generatedImage: null
    };
  }

  render() {
  return (<p> hello world </p>);
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
