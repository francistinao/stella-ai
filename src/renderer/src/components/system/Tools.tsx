/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

// Tools components
import { Toolbox } from '@/components/system/mini/index'

const Tools: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`flex flex-col gap-4 border-y border-r ${theme === 'dark' ? ' border-zinc-700' : 'border-zinc-500'}`}
    >
      <Toolbox />
    </div>
  )
}

export default Tools
