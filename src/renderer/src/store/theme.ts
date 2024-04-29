/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { create } from 'zustand'

interface ThemeStore {
  theme: string
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  setTheme: (theme: string) => set({ theme })
}))
