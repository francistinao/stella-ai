/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { create } from 'zustand'

interface ToolProps {
  tool_name: string
  tool_id: string
  is_active: boolean
  setToolName: (tool_name: string) => void
}

export const useToolStore = create<ToolProps>((set) => ({
  tool_name: '',
  tool_id: '',
  is_active: false,
  setToolName: (tool_name: string) => set({ tool_name })
}))
