/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { create } from 'zustand'

interface ThemeStore {
  theme: string
  setTheme: (theme: string) => void
}

interface NoticeStore {
  showNotice: boolean
  setShowNotice: (showNotice: boolean) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  setTheme: (theme: string) => set({ theme })
}))

export const useNoticeStore = create<NoticeStore>((set) => ({
  showNotice: false,
  setShowNotice: (showNotice: boolean) => set({ showNotice })
}))
