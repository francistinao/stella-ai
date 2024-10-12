/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ToolProps {
  tool_name: string
  tool_id: string
  is_active: boolean
  is_draw: boolean
  is_ruler: boolean
  boundarySize?: number
  boundaryColor?: {
    color: string
    rgb_val: string
  }
  startPoint: {
    x: number
    y: number
  } | null
  endPoint: {
    x: number
    y: number
  } | null
  setBoundaryColor?: (boundaryColor: { color: string; rgb_val: string }) => void
  setBoundarySize?: (boundarySize: number) => void
  setToolName: (tool_name: string) => void
  setToolActivity: (is_active: boolean) => void
  setIsDraw: (is_draw: boolean) => void
  setIsRuler: (is_draw: boolean) => void
  isAddImage?: boolean
  setIsAddImage?: (isAddImage: boolean) => void
  setStartPoint: (startPont: { x: number; y: number } | null) => void
  setEndPoint: (endPoint: { x: number; y: number } | null) => void
}

interface SliderProps {
  toggleVisibilityFirst: boolean
  toggleVisibilitySecond: boolean
  setToggleVisibilityFirst: (toggleVisibility: boolean) => void
  setToggleVisibilitySecond: (toggleVisibility: boolean) => void
}

interface ImageConfigProps {
  contrastLevel: number
  highlightsAmount: number
  sepia: number
  is_invert: number
  setContrastLevel: (contrastLevel: number) => void
  setHighlightsAmount: (highlightsAmount: number) => void
  setSepia: (sepia: number) => void
  setIsInvert: (is_invert: number) => void
}

export const useSliderStore = create<SliderProps>((set) => ({
  toggleVisibilityFirst: false,
  toggleVisibilitySecond: true,
  setToggleVisibilityFirst: (toggleVisibilityFirst: boolean) => set({ toggleVisibilityFirst }),
  setToggleVisibilitySecond: (toggleVisibilitySecond: boolean) => set({ toggleVisibilitySecond })
}))

export const useToolStore = create<ToolProps>((set) => ({
  tool_name: '',
  tool_id: '',
  is_active: true,
  is_draw: false,
  is_ruler: false,
  boundarySize: 3,
  boundaryColor: {
    color: '#FF0000',
    rgb_val: 'rgba(255, 0, 0, 0.2)'
  },
  startPoint: null,
  endPoint: null,
  setBoundaryColor: (boundaryColor: { color: string; rgb_val: string }) => set({ boundaryColor }),
  setBoundarySize: (boundarySize: number) => set({ boundarySize }),
  setToolName: (tool_name: string) => set({ tool_name }),
  setToolActivity: (is_active: boolean) => set({ is_active }),
  setIsDraw: (is_draw: boolean) => set({ is_draw }),
  setIsRuler: (is_ruler: boolean) => set({ is_ruler }),
  isAddImage: false,
  setIsAddImage: (isAddImage: boolean) => set({ isAddImage }),
  setStartPoint: (startPoint: { x: number; y: number } | null) => set({ startPoint }),
  setEndPoint: (endPoint: { x: number; y: number } | null) => set({ endPoint })
}))

export const useImageConfigStore = create<ImageConfigProps>((set) => ({
  contrastLevel: 1,
  highlightsAmount: 1,
  highlightsTone: 0,
  sepia: 0,
  is_invert: 0,
  setContrastLevel: (contrastLevel: number) => set({ contrastLevel }),
  setHighlightsAmount: (highlightsAmount: number) => set({ highlightsAmount }),
  setSepia: (sepia: number) => set({ sepia }),
  setIsInvert: (is_invert: number) => set({ is_invert })
}))
