/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

const TitleBar: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`px-10 w-full flex gap-x-2 items-start justify-start border-b ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} text-[10px] p-5 rounded-lg`}
    >
      <div className="flex gap-4 items-center">
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} font-bold text-xl`}>
          STELLAmulator
          <span className="relative bottom-4 text-dark bg-light_g rounded-md text-xs px-1 py-1">
            beta
          </span>
        </h1>
      </div>
    </div>
  )
}

export default TitleBar
