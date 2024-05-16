import { create } from 'zustand'

interface Visible {
    visible: boolean;
    setVisible: (visible: boolean) => void; 
}

export const useVisible = create<Visible>((set) => ({
    visible: true,
    setVisible: (visible) => set({ visible })
}))