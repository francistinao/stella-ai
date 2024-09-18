/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface Coord {
  x: number
  y: number
}

interface Toggle {
  toggleResult: boolean
  setToggleResult: (toggleResult: boolean) => void
}

interface CoordStore {
  coord: Coord[]
  resultCoord: Coord[]
  setCoord: (newCoord: Coord[]) => void
  setResultCoord: (newResultCoord: Coord[]) => void
}

export const useToggleResult = create<Toggle>((set) => ({
  toggleResult: false,
  setToggleResult: (toggleResult) => set({ toggleResult })
}))

export const useCoordStore = create<CoordStore>((set) => ({
  coord: [],
  resultCoord: [],
  setCoord: (newCoord) => set({ coord: newCoord }),
  setResultCoord: (newResultCoord) => set({ resultCoord: newResultCoord })
}))
