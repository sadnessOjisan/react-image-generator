import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { Stage, Layer, Rect, Transformer, Image } from "react-konva";

class Rectangle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log("[Rectangle]<handleChange>this.props:  ", this.props);
    const shape = e.target;
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation()
    });
  }
  render() {
    return (
      <Rect
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

class App extends Component {
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

  _handleAddImage(e) {
    const addedImageURL = e[0].preview;
    const image = new window.Image();
    image.src = addedImageURL;
    image.onload = () => {
      this.imageNode.getLayer().batchDraw();
    };
    const imageObject = {
      src: image, 
      name: e[0].preview, 
      x: 30,
      y:30
    };
    this.setState({
      ...this.state,
      inputImages: [...this.state.inputImages, imageObject]
    });
  }

  handleStageMouseDown(e) {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
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
        selectedShapeName: name
      });
    } else {
      this.setState({
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
    console.log("this.state: ", this.state)
    return (
      <Container>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.handleStageMouseDown}
          ref={ref => {
            this.stageRef = ref;
          }}
        >
          <Layer>
            {inputImages.map((img, i) => (
              <Image
                key={i}
                {...img}
                onTransform={newProps => {
                  this.handleRectChange(i, newProps);
                }}
                image={img.src}
                ref={ref => {
                    this.imageNode = ref;
                  }}
              />
            ))}
            <TransformerComponent
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </Stage>
        <Dropzone onDrop={this._handleAddImage} />
        <button onClick={this._handleClickExportBtn}> 画像出力！ </button>
        <h2> しゅつりょく！ </h2> <img src={generatedImage} />
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
