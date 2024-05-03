/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface StoredImagesState {
  imageName: string
  imageData: BinaryData
  imageTimeframe: string
  setImageName: (imageName: string) => void
  setImage: (imageData: BinaryData) => void
}
