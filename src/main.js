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
    const addedImageURL = e[0].preview;
    const image = new window.Image();
    image.src = addedImageURL;
    image.onload = () => {
        this.imageNode.getLayer().batchDraw();
      };
    const imageObject = {src: image, x: 30, y: 30}
    this.setState({
      ...this.state,
      inputImages: [...this.state.inputImages, imageObject]
    });
  }

  _handleDragEnd(e, idx){
    const dragedImage = this.state.inputImages[idx]
    dragedImage.x = e.target.x()
    dragedImage.y = e.target.y()
    console.log("idx: ", idx)
    console.log("this.state.inputImages: ", this.state.inputImages)
    const images = Object.assign({}, images)
    images.splice(idx+1, 1, dragedImage)
    console.log("images: ", images)
      this.setState({
          ...this.state, 
          inputImages: images
      })
  }

  render() {
    const { inputImages } = this.state;
    return (
      <Container>
        <Stage width={600} height={400}>
          <Layer>
            {inputImages.map((image, idx) => {
              return (
                <React.Fragment>
                  <Image
                    image={image.src}
                    key={idx}
                    y={image.x}
                    x={image.y}
                    ref={node => {
                        this.imageNode = node;
                      }}
                      draggable
                      onDragEnd={(e)=>this._handleDragEnd(e, idx)}
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
