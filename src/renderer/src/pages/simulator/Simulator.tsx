/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

const Simulator: React.FC = () => {
  const { theme } = useThemeStore()
  return <div className={`w-full h-screen ${theme === 'dark' ? '' : ''}`}></div>
}

export default Simulator
