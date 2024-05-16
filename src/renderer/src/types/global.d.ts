export interface StoredImagesState {
  imageName: string
  imageData: BinaryData
  imageTimeframe: string
  setImageName: (imageName: string) => void
  setImage: (imageData: BinaryData) => void
}

export interface RulerInterface {
  scroll(scrollPos: number): any;
  resize(): any;
}

export interface RulerProps {
  type?: "horizontal" | "vertical";
  width?: number;
  height?: number;
  unit?: number;
  zoom?: number;
  direction?: "start" | "end";
  style?: IObject<any>;
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
  textFormat?: (scale: number) => string;
}

export interface StoredImagesState {
  imageName: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
  path?: string; 
  imageData: BinaryData;
  imageTimeframe: string;
}
