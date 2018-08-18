import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import "./reset.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputImages: [],
      generatedImage: null
    };
    this._handleAddImage = this._handleAddImage.bind(this);
  }

  _handleAddImage(e) {
    console.log("<_handleAddImage> e: ", e);
    const addedImage = e[0];
    this.setState({
      ...this.state,
      inputImages: [...this.state.inputImages, addedImage.preview]
    });
  }

  render() {
    const { inputImages } = this.state;
    console.log("render inputImages: ", inputImages);
    return (
      <Container>
        <ImageList>
          {inputImages.map(image => {
            return(<ImageWrapper>
              <TrimedImg src={image} />
            </ImageWrapper>);
          })}
        </ImageList>
        <Dropzone onDrop={this._handleAddImage} />
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
`;

const ImageList = styled.div`
  overflow-x: scroll;
  width: 100%;
`;

const ImageWrapper = styled.div`
width: 300px;
height: 300px;
`

const TrimedImg = styled.img`
max-width: 100%; 
max-height: 100%;
`

ReactDOM.render(<App />, document.getElementById("root"));
