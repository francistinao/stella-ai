/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

interface Props {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Sidebar: React.FC<Props> = () => {
  const { theme } = useThemeStore()

  return (
    <div className={`h-full w-full flex ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
      <div className="pt-9  w-full">
        <div className={`${theme === 'dark' ? 'bg-gray_l' : 'bg-dirty'} rounder-l-md`}>
          <h1
            className={`pl-8 pr-4 font-semibold py-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            Home
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
