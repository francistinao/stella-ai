/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ResultProps {
  result: {
    data: any
    error: any
  } | null
  isLoading: boolean | undefined
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
  setResult: (result: any) => void
  isAddFindings?: boolean
  setIsAddFindings?: (isAddFindings: boolean) => void
}

export const useResultStore = create<ResultProps>((set) => ({
  result: {
    // data: {
    //   hemmoragic: {
    //     Area: 0,
    //     Lesion_Boundary_Points: [],
    //     Mean: 0
    //   },
    //   ischemic: {
    //     Area: 0,
    //     Lesion_Boundary_Points: [],
    //     Mean: 0
    //   }
    // },
    data: undefined,
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
