/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ResultProps {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
}

export const useResultStore = create<ResultProps>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  isError: false,
  setIsError: (isError: boolean) => set({ isError })
}))
