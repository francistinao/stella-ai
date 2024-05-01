/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

interface CTScanCanvasProps {
  remainingWidth: number
}

const CTScanCanvas: React.FC<CTScanCanvasProps> = ({ remainingWidth }) => {
  const { theme } = useThemeStore()
  const width = `calc(65vw - ${remainingWidth}px)`
  return (
    <div
      style={{ width: width, transition: 'width 0.3s ease' }}
      className={`flex flex-col ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
    ></div>
  )
}

export default CTScanCanvas
