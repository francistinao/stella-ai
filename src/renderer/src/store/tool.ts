/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ToolProps {
  tool_name: string
  tool_id: string
  is_active: boolean
  is_draw: boolean
  boundarySize?: number
  boundaryColor?: {
    color: string;
    rgb_val: string;
  }
  setBoundaryColor?: (boundaryColor: { color: string; rgb_val: string }) => void
  setBoundarySize?: (boundarySize: number) => void
  setToolName: (tool_name: string) => void
  setToolActivity: (is_active: boolean) => void
  setIsDraw: (is_draw: boolean) => void
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

export const useToolStore = create<ToolProps>((set) => ({
  tool_name: '',
  tool_id: '',
  is_active: true,
  is_draw: false,
  boundarySize: 3,
  boundaryColor: {
    color: '#FF0000',
    rgb_val:  'rgba(255, 0, 0, 0.2)'
  },
  setBoundaryColor: (boundaryColor: { color: string, rgb_val: string }) => set({ boundaryColor }),
  setBoundarySize: (boundarySize: number) => set({ boundarySize }),
  setToolName: (tool_name: string) => set({ tool_name }),
  setToolActivity: (is_active: boolean) => set({ is_active }),
  setIsDraw: (is_draw: boolean) => set({ is_draw })
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
