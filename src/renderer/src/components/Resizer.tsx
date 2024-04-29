/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

interface Props {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Resizer: React.FC<Props> = ({ handleMouseDown }) => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`border ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'} cursor-col-resize`}
      onMouseDown={handleMouseDown}
    ></div>
  )
}

export default Resizer
