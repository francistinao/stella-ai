/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { canvasSize } from './RandomCTScan'
import { ResultsModal } from '@/components/gamification/index'

const PRED_PASSING = 50
const PRED_PLOT_PASSING = 30

interface Score {
  score_in_type: number | null
  score_in_plot: number | null
}

const SidePanel: React.FC<{
  results: {
    stroke: string
    lesionPoints: {
      x: number
      y: number
    }[]
  } | null
}> = ({ results }) => {
  const { theme } = useThemeStore()
  const { coord, setCoord, resultCoord } = useCoordStore()
  const [score, setScore] = useState<Score>({
    score_in_type: null,
    score_in_plot: null
  })
  const [isLesionBoundaryDrop, setIsLesionBoundaryDrop] = useState(false)
  const [strokeType, setStrokeType] = useState('')

  const hasPredictionPlots = results !== null && resultCoord.length > 0

  const totalWidth = window.innerWidth
  const totalHeight = window.innerHeight

  const handleChange = (event: SelectChangeEvent) => {
    setStrokeType(event.target.value)
  }

  return (
    <div
      className={`w-[500px] m-3 rounded-md ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} flex flex-col gap-4 p-3`}
    >
      {(score?.score_in_type ?? 0) >= PRED_PASSING &&
        (score?.score_in_plot ?? 0) >= PRED_PLOT_PASSING && (
          <Confetti width={totalWidth} height={totalHeight} />
        )}
      <ResultsModal
        score={score as { score_in_type: number; score_in_plot: number }}
        setScore={setScore}
      />
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
        {!hasPredictionPlots ? (
          <span className=" text-xs text-red-500 ml-2">
            AI is getting the prediction, please wait....
          </span>
        ) : (
          <h1
            className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} text-lg text-center font-semibold`}
          >
            Start plotting now!
          </h1>
        )}
        <div
          className={`py-8 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
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
          className={`my-4 border ${theme === 'dark' ? 'bg-dark text-white border-zinc-700' : 'bg-white text-dark border-zinc-400'} rounded-md py-2`}
          onClick={() => {
            setCoord([])
          }}
        >
          Reset Plots
        </button>
        <FormControl
          sx={{ m: 1, minWidth: 120, borderColor: theme === 'dark' ? 'white' : 'black' }}
        >
          <InputLabel
            sx={{
              color: '#72FC5E'
            }}
            id="demo-simple-select-helper-label"
          >
            Stroke
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={strokeType}
            label="Age"
            onChange={handleChange}
            sx={{
              color: '#72FC5E',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#72FC5E'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#72FC5E'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#72FC5E'
              }
            }}
          >
            <MenuItem value={'Ischemic Stroke'}>Ischemic Stroke</MenuItem>
            <MenuItem value={'Hemorrhagic Stroke'}>Hemorrhagic Stroke</MenuItem>
          </Select>
        </FormControl>

        <button
          className="font-semibold bg-light_g rounded-full text-dark py-2"
          onClick={() => {
            if (results && results.lesionPoints && Array.isArray(results.lesionPoints)) {
              const transformedCoord = coord.map((point) => [point.x, point.y])

              try {
                const assessmentResult = assessPerformance(
                  strokeType,
                  results.stroke,
                  results.lesionPoints,
                  transformedCoord,
                  canvasSize
                )
                setScore(assessmentResult)
              } catch (error) {
                console.error('Error in assessPerformance:', error)
              }
            } else {
              console.error('Invalid results or lesionPoints:', results)
            }
          }}
        >
          Assess
        </button>
      </div>
    </div>
  )
}

export default SidePanel
