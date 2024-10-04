/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'

//Results Components
import { Steps, Findings, CreateReport } from './mini'
import LesionVisualizer from './mini/LesionVisualizer'

interface ResultsProps {
  remainingWidth: number
}

const Results: React.FC<ResultsProps> = ({ remainingWidth }) => {
  const { theme } = useThemeStore()
  return (
    <div
      style={{ width: `${remainingWidth}px` }}
      className={`border-l ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} h-full p-4`}
    >
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-white'} w-full px-3 py-2 rounded-md  flex flex-col gap-4`}
      >
        <Steps />
        <LesionVisualizer />
        <Findings width={remainingWidth} />
        <CreateReport />
      </div>
    </div>
  )
}

export default Results
