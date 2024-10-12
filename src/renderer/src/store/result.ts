/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'
import { toPng } from 'html-to-image'

interface ClassificationType {
  category: string
  type: string
}

interface Classification {
  confidence: number
  density_value: number
  houndsfield_unit: Array<number>
  type: ClassificationType
}

interface LesionBoundaryPoints {
  Area: number
  Lesion_Boundary_Points: [number, number][]
  Mean: number
}

interface SliceResult {
  slice_index: number
  stroke_type: string
  classification: Classification
  lesion_boundary_points: LesionBoundaryPoints
}

interface ResultProps {
  result: {
    ischemic: any
    hemmoragic: any
    error: any
  }
  resultToDisplay: {
    lesion_boundary_points: {
      Area: number
      Lesion_Boundary_Points: [number, number][]
      Mean: number
    }
    classification: {
      confidence: number
      density_value: number
      houndsfield_unit: Array<number>
      type: {
        category: string
        type: string
      }
    }
    stroke_type: ''
  }
  newResult: SliceResult[]
  isLoading: boolean | undefined
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
  setResult: (result: any) => void
  isAddFindings?: boolean
  setIsAddFindings?: (isAddFindings: boolean) => void
  setNewResult: (newResult: any) => void
  setResultToDisplay: (resultToDisplay: any) => void
}

interface CaptureState {
  isCapture: boolean
  capturedContent: string[]
  setIsCapture: (boolean) => void
  setCapturedContent: (content: HTMLElement | null) => void
  resetCapturedContent: () => void
}

export const useResultStore = create<ResultProps>((set) => ({
  result: {
    hemmoragic: null,
    ischemic: null,
    error: null
  },
  resultToDisplay: {
    lesion_boundary_points: {
      Area: 0,
      Lesion_Boundary_Points: [],
      Mean: 0
    },
    classification: {
      confidence: 0,
      density_value: 0,
      houndsfield_unit: [],
      type: {
        category: '',
        type: ''
      }
    },
    stroke_type: ''
  },
  newResult: [],
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isError: false,
  setIsError: (isError: boolean) => set({ isError }),
  setResult: (result: any) => set({ result }),
  isAddFindings: false,
  setIsAddFindings: (isAddFindings: boolean) => set({ isAddFindings }),
  setNewResult: (newResult: any) => set({ newResult }),
  setResultToDisplay: (resultToDisplay: any) => set({ resultToDisplay })
}))

export const useCaptureStore = create<CaptureState>((set) => ({
  isCapture: false,
  capturedContent: [],
  setIsCapture: (isCapture) => set({ isCapture }),
  setCapturedContent: (content) => {
    if (content) {
      toPng(content).then((dataUrl) => {
        set((state) => ({
          capturedContent: [...state.capturedContent, dataUrl]
        }))
      })
    }
  },
  resetCapturedContent: () => set({ capturedContent: [] })
}))
