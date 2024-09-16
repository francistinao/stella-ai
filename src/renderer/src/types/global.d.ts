/* eslint-disable prettier/prettier */
export interface StoredImagesState {
  imageName: string
  imageData: BinaryData
  imageTimeframe: string
  setImageName: (imageName: string) => void
  setImage: (imageData: BinaryData) => void
}

export interface RulerInterface {
  scroll(scrollPos: number): any
  resize(): any
}

export interface RulerProps {
  type?: 'horizontal' | 'vertical'
  width?: number
  height?: number
  unit?: number
  zoom?: number
  direction?: 'start' | 'end'
  style?: IObject<any>
  backgroundColor?: string
  lineColor?: string
  textColor?: string
  textFormat?: (scale: number) => string
}

export interface StoredImagesState {
  imageName: string
  size: number
  type: string
  lastModified: number
  lastModifiedDate: Date
  path?: string
  imageData: BinaryData
  imageTimeframe: string
}

export interface ControlPanelProps {
  opacity: number
  setOpacity: (value: number) => void
  wireframe: boolean
  setWireframe: (value: boolean) => void
  showCrossSection: boolean
  setShowCrossSection: (value: boolean) => void
  crossSectionHeight: number
  setCrossSectionHeight: (value: number) => void
  theme: string
  showMeasurements: boolean
  setShowMeasurements: (value: boolean) => void
  showAxes: boolean
  setShowAxes: (value: boolean) => void
  showMeasurements: boolean
  setShowMeasurements: (value: boolean) => void
  showAxes: boolean
  setShowAxes: (value: boolean) => void
  rotationSpeed: number
  setRotationSpeed: (value: number) => void
}
