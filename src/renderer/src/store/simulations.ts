/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Coord {
  x: number
  y: number
}

interface Toggle {
  toggleResult: boolean
  setToggleResult: (toggleResult: boolean) => void
}

interface Game {
  isBlitzMode: boolean
  startBlitzMode: boolean
  blitzModeRecord: number
  debugStore?: () => void
  setIsBlitzMode: (isBlitzMode: boolean) => void
  setStartBlitzMode: (startBlitzMode: boolean) => void
  setBlitzModeRecord: (record: number) => void
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

export const useGameStore = create(
  persist<Game>(
    (set, get) => ({
      isBlitzMode: false,
      startBlitzMode: false,
      blitzModeRecord: 0,
      setIsBlitzMode: (isBlitzMode) => set({ isBlitzMode }),
      setStartBlitzMode: (startBlitzMode) => {
        set({ startBlitzMode })
      },
      setBlitzModeRecord: (record) => {
        set({ blitzModeRecord: record })
      },
      debugStore: () => {
        console.log('Current store state:', get())
      }
    }),
    {
      name: 'game-storage',
      getStorage: () => localStorage
    }
  )
)
