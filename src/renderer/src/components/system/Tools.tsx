/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

// Tools components
import { Toolbox, ImageConfig } from '@/components/system/mini/index'

const Tools: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div className={`flex flex-col ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      {/* Stella Toolbox */}
      <div
        className={`border-b border-r ${theme === 'dark' ? ' border-zinc-700' : 'border-zinc-500'}`}
      >
        <Toolbox />
      </div>
      {/* Image Config */}
      <div
        className={`border-b border-r ${theme === 'dark' ? ' border-zinc-700' : 'border-zinc-500'}`}
      >
        <ImageConfig />
      </div>
    </div>
  )
}

export default Tools
