/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import logo from '@/assets/logo.png'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useThemeStore } from '@/store/theme'
import { useCoordStore } from '@/store/simulations'
import { motion } from 'framer-motion'
import { assessPerformance } from '@/lib/assessment'
import Confetti from 'react-confetti'

const PRED_PASSING = 30
const PRED_PLOT_PASSING = 50

const SidePanel: React.FC<{
  results: {
    stroke: string
    lesionPoints: {
      x: number
      y: number
    }[]
  }
}> = ({ results }) => {
  const { theme } = useThemeStore()
  const { coord, setCoord } = useCoordStore()
  const [score, setScore] = useState({
    score_in_type: 0,
    score_in_plot: 0
  })
  const [isLesionBoundaryDrop, setIsLesionBoundaryDrop] = useState(false)

  const totalWidth = window.innerWidth
  const totalHeight = window.innerHeight

  return (
    <div
      className={`w-[500px] m-3 rounded-md ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} flex flex-col gap-4 p-3`}
    >
      {score.score_in_type >= PRED_PASSING && score.score_in_plot >= PRED_PLOT_PASSING && (
        <Confetti width={totalWidth} height={totalHeight} />
      )}
      <div className="flex w-full gap-4 items-center">
        <div
          className={`border-2 ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} rounded-full`}
        >
          <img src={logo} alt="logo" className="w-12 h-10" />
        </div>
        <div
          className={`w-full flex gap-4 items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-full py-2 pl-4`}
        >
          <div className="h-[20px] w-[5px] bg-light_g" />
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} font-bold text-[13px]`}>
            STELLAmulator
          </h1>
        </div>
      </div>
      <div
        className={`${theme === 'dark' ? 'text-white bg-dark' : 'text-dark bg-white'} p-3 rounded-md text-xs text-left flex flex-col gap-4`}
      >
        <p>
          Enhance your skills in stroke identification and classification through interactive
          assessments powered by STELLA's advanced AI.
        </p>
        <p>
          Plot your predictions on the CT Scan and select the stroke type based on your analysis.
        </p>
        <h1 className="font-semibold text-lg">Be precise as possible</h1>
      </div>
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-white'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="font-semibold text-xs">Your Plots</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isLesionBoundaryDrop ? 180 : 0 }}
            onClick={() => setIsLesionBoundaryDrop(!isLesionBoundaryDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isLesionBoundaryDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-8 max-h-[150px] overflow-y-auto customScroll"
        >
          <div
            className={`w-full flex flex-col gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            <div className="grid grid-cols-4 gap-2">
              {coord?.map((point, idx) => {
                return (
                  <div
                    key={idx}
                    className={`justify-between items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-2 rounded-lg`}
                  >
                    <h1 className="text-xs font-regular">
                      {/* eslint-disable-next-line */}
                      {/* @ts-ignore */}
                      X: {point.x.toFixed(1)}, Y: {point.y.toFixed(1)}
                    </h1>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
        <button
          className="mt-2 bg-light_g text-center text-dark rounded-full py-1 font-semibold"
          onClick={() => {
            setCoord([])
          }}
        >
          Reset Points
        </button>
        <button
          onClick={() => {
            if (results) {
              setScore(
                assessPerformance(
                  'Hemorrhagic Stroke',
                  results?.stroke,
                  results?.lesionPoints,
                  coord
                )
              )
            }
          }}
        >
          Test
        </button>
      </div>
    </div>
  )
}

export default SidePanel
