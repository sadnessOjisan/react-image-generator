export type ImageElementProps = {
  onTransform: SyntheticEvent => void
};

export type ImageElementState = {
  isLoaded: boolean
};

type ImageObject = {
  src: image,
  name: string,
  x: number,
  y: number
};

export type AppState = {
  inputImages: ImageObject[],
  generatedImage: string,
  selectedShapeName: string
};
