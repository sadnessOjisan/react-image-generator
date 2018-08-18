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
    this._handleClickExportBtn = this._handleClickExportBtn.bind(this);
  }

  _handleAddImage(e) {
    const addedImageURL = e[0].preview;
    const image = new window.Image();
    image.src = addedImageURL;
    image.onload = () => {
      this.imageNode.getLayer().batchDraw();
    };
    const imageObject = { src: image, x: 30, y: 30 };
    this.setState({
      ...this.state,
      inputImages: [...this.state.inputImages, imageObject]
    });
  }

  _handleDragEnd(e, idx) {
    const dragedImage = this.state.inputImages[idx];
    dragedImage.x = e.target.x();
    dragedImage.y = e.target.y();
    const images = Object.assign({}, images);
    images.splice(idx + 1, 1, dragedImage);
    this.setState({
      ...this.state,
      inputImages: images
    });
  }

  _handleClickExportBtn() {
    console.log("this.stageRef: ", this.stageRef);
    console.log("this.stageRef.getStage(): ", this.stageRef.getStage());
    const data = this.stageRef.getStage().toDataURL("image/png");
    this.setState({
      ...this.state,
      generatedImage: data
    });
  }

  render() {
    const { inputImages, generatedImage } = this.state;
    return (
      <Container>
        <Stage
          width={600}
          height={400}
          ref={ref => { this.stageRef = ref; }}
        >
          <Layer
            ref={node => {
              this.layer = node;
            }}
          >
            {inputImages.map((image, idx) => {
              return (
                <React.Fragment>
                  <Image
                    image={image.src}
                    key={idx}
                    y={image.x}
                    x={image.y}
                    ref={node => {
                        console.log("node: ", node)
                      this.imageNode = node;
                    }}
                    draggable
                    onDragEnd={e => this._handleDragEnd(e, idx)}
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
        <Dropzone onDrop={this._handleAddImage} />
        <button onClick={this._handleClickExportBtn}>画像出力！</button>
        <h2>しゅつりょく！</h2>
        <img src={generatedImage} />
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

ReactDOM.render(<App />, document.getElementById("root"));
