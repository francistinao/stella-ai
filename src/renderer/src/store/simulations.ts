/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface Coord {
  x: number
  y: number
}

interface CoordStore {
  coord: Coord[]
  setCoord: (newCoord: Coord[]) => void
}

export const useCoordStore = create<CoordStore>((set) => ({
  coord: [],
  setCoord: (newCoord) => set({ coord: newCoord })
}))
