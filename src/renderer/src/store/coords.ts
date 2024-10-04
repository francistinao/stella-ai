/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface LesionData {
  Mean: number
  Area: number
  //mask RCNN
  //Lesion_Boundary_Points: LesionBoundaryPoint[]
  //unet
  Lesion_Boundary_Points: [number, number][]
}

interface Props {
  lesionData: LesionData
  setLesionData: (lesionData: LesionData) => void
}

export const useCoordsStore = create<Props>((set) => ({
  lesionData: {
    Mean: 0,
    Area: 0,
    Lesion_Boundary_Points: []
  },
  setLesionData: (lesionData: LesionData) => set({ lesionData })
}))
