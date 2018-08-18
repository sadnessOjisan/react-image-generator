import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import './reset.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputImages: [],
      generatedImage: null
    };
  }

  render() {
  return (<Container><p> hello world </p></Container>);
  }
}

const Container = styled.div`
width: 100%; 
display: flex;
justify-content: center;
`

ReactDOM.render(<App />, document.getElementById("root"));
