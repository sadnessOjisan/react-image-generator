import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import Konva from "konva";
import { Stage, Layer, Image, Text } from "react-konva";
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
    const addedImageURL = e[0].preview;
    const image = new window.Image();
    image.src = addedImageURL;
    console.log("<_handleAddImage> addedImageURL: ", addedImageURL);
    this.setState({
      ...this.state,
      inputImages: [...this.state.inputImages, image]
    });
    image.onload = () => {
        this.imageNode.getLayer().batchDraw();
      };
  }

  render() {
    const { inputImages } = this.state;
    console.log("render inputImages: ", inputImages);
    return (
      <Container>
        <Stage width={600} height={400}>
          <Layer>
            {inputImages.map((image, idx) => {
              return (
                <React.Fragment>
                  <Image
                    image={image}
                    key={idx}
                    y={30}
                    x={30}
                    ref={node => {
                        this.imageNode = node;
                      }}
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
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
`;

const TrimedImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

ReactDOM.render(<App />, document.getElementById("root"));
