/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

// Tools components
import { Toolbox, ImageConfig } from '@/components/system/mini/index'

interface ToolsProps {
  observeWidth: number
}

const Tools: React.FC<ToolsProps> = ({ observeWidth }) => {
  const { theme } = useThemeStore()
  return (
    <div className={`flex flex-col ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      {/* Stella Toolbox */}
      <div className={`border-b  ${theme === 'dark' ? ' border-zinc-700' : 'border-zinc-500'}`}>
        <Toolbox observeWidth={observeWidth} />
      </div>
      {/* Image Config */}

      <ImageConfig />
    </div>
  )
}

export default Tools
