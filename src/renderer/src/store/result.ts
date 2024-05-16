/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ResultProps {
  result: {
    data: any
    error: any
  }
  isLoading: boolean | undefined
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
}

export const useResultStore = create<ResultProps>((set) => ({
  result: {
    // data: {
    //   lesion_boundary_points: [
    //     [0, 0],
    //     [0, 0],
    //     [0, 0],
    //     [0, 0]
    //   ]
    // },
    data: undefined,
    error: null
  },
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isError: false,
  setIsError: (isError: boolean) => set({ isError })
}))
