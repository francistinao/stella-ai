/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'
import { toPng } from 'html-to-image'

interface ResultProps {
  result: {
    ischemic: any
    hemmoragic: any
    error: any
  }
  isLoading: boolean | undefined
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
  setResult: (result: any) => void
  isAddFindings?: boolean
  setIsAddFindings?: (isAddFindings: boolean) => void
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
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isError: false,
  setIsError: (isError: boolean) => set({ isError }),
  setResult: (result: any) => set({ result }),
  isAddFindings: false,
  setIsAddFindings: (isAddFindings: boolean) => set({ isAddFindings })
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
