// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { Stage, Layer, Transformer, Image } from "react-konva";
import { ImageElementProps, ImageElementState, AppState } from "./typedef";

const canvasWidth: number = 600;
const canvasHeight: number = 600;

class ImageElement extends React.Component<
  ImageElementProps,
  ImageElementState
> {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: SyntheticEvent<HTMLButtonElement>) {
    const shape = e.target;
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation()
    });
  }

  componentDidMount() {
    this.imageNode.getLayer().batchDraw();
    this.setState({ isLoaded: true });
  }

  render() {
    this.imageNode && this.imageNode.getLayer().batchDraw();
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        scaleX={1}
        scaleY={1}
        fill={this.props.fill}
        name={this.props.name}
        onDragEnd={this.handleChange}
        onTransformEnd={this.handleChange}
        draggable
        image={this.props.src}
        ref={ref => {
          this.imageNode = ref;
        }}
      />
    );
  }
}

class TransformerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.checkNode = this.checkNode.bind(this);
  }
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne("." + selectedShapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class App extends Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      inputImages: [],
      generatedImage: null,
      selectedShapeName: ""
    };
    this._handleAddImage = this._handleAddImage.bind(this);
    this._handleClickExportBtn = this._handleClickExportBtn.bind(this);
    this.handleStageMouseDown = this.handleStageMouseDown.bind(this);
    this.handleRectChange = this.handleRectChange.bind(this);
  }

  _handleAddImage(e: SyntheticEvent) {
    const addedImageURL = e[0].preview;
    const image = new window.Image();
    image.src = addedImageURL;
    const imageObject = {
      src: image,
      name: e[0].preview,
      x: 30,
      y: 30
    };
    image.onload = () => {
      this.setState({
        ...this.state,
        inputImages: [...this.state.inputImages, imageObject]
      });
      this.imageNode.getLayer().batchDraw();
    };
  }

  handleStageMouseDown(e) {
    if (e.target === e.target.getStage()) {
      this.setState({
        ...this.state,
        selectedShapeName: ""
      });
      return;
    }

    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }
    const name = e.target.name();
    const rect = this.state.inputImages.find(r => r.name === name);
    if (rect) {
      this.setState({
        ...this.state,
        selectedShapeName: name
      });
    } else {
      this.setState({
        ...this.state,
        selectedShapeName: ""
      });
    }
  }

  handleRectChange(index, newProps) {
    const inputImages = this.state.inputImages.concat();
    inputImages[index] = {
      ...inputImages[index],
      ...newProps
    };
    this.setState({
      inputImages
    });
  }

  _handleClickExportBtn() {
    const data = this.stageRef.getStage().toDataURL("image/png");
    this.setState({
      ...this.state,
      generatedImage: data
    });
  }
  render() {
    const { image, inputImages, generatedImage } = this.state;
    this.imageNode && this.imageNode.getLayer().batchDraw();
    console.log("[App]<render>this.state: ", this.state);
    return (
      <Container>
        <h1>画像配置ジェネレータ</h1>
        <StyledStage
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={this.handleStageMouseDown}
          ref={ref => {
            this.stageRef = ref;
          }}
        >
          <Layer>
            {inputImages.map((img, i) => (
              <ImageElement
                key={i}
                {...img}
                onTransform={newProps => {
                  this.handleRectChange(i, newProps);
                }}
              />
            ))}
            <TransformerComponent
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </StyledStage>
        <Dropzone onDrop={this._handleAddImage}>
          ここに画像をDnDしてね！
        </Dropzone>

        <button onClick={this._handleClickExportBtn}> 画像出力！ </button>
        <h2> ↓出力↓ </h2>
        <img src={generatedImage} />
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
`;

const StyledStage = styled(Stage)`
  border: solid 1px gray;
  margin: 16px;
`;

ReactDOM.render(<App />, document.getElementById("root"));
