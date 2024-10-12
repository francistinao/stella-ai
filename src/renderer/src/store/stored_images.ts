/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface LoadingImage {
  isImageUploadLoading: boolean
  setIsImageUploadLoading: (isLoading: boolean) => void
}

interface StoredImagesState {
  image_id: number | null
  imageName?: string
  name: string
  size: number
  type: string
  lastModified: number
  lastModifiedDate: Date
  path?: string
  imageData: BinaryData
  imageTimeframe: string
  setImages?: (images: StoredImagesState[]) => void
  addImage?: (image: StoredImagesState) => void
  images?: StoredImagesState[]
  setSelectedImage?: (image: StoredImagesState | null) => void
  selectedImage?: StoredImagesState | null

  // this corresponds to the segmentation result for the selected image
  isLoading?: boolean | undefined
  setIsLoading?: (isLoading: boolean) => void
  result?: {
    data: any
    error: any
  }
  setResults?: (result: { data: any; error: any }) => void
}

export const useLoadingImage = create<LoadingImage>((set) => ({
  isImageUploadLoading: false,
  setIsImageUploadLoading: (isImageUploadLoading: boolean) => set({ isImageUploadLoading })
}))

export const useStoredImages = create<StoredImagesState>((set) => ({
  image_id: null,
  name: '',
  size: 0,
  type: '',
  lastModified: 0,
  lastModifiedDate: new Date(),
  path: '',
  imageData: new ArrayBuffer(0),
  imageTimeframe: '',
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [...(state.images ?? []), image] })),
  images: [],
  setSelectedImage: (image: StoredImagesState | null) => set({ selectedImage: image }),
  selectedImage: undefined,
  isLoading: undefined,
  setIsLoading: (isLoading) => set({ isLoading }),
  result: {
    data: undefined,
    error: undefined
  },
  setResults: (result) => set({ result })
}))
