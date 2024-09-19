/* eslint-disable prettier/prettier */
import React, { Dispatch, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'
import { useToggleResult } from '@/store/simulations'
import { useToggleSlider } from 'react-toggle-slider'
import { useGameStore } from '@/store/simulations'
import { formatTime } from '@/utils/formatTime'
const PRED_PASSING = 30
const PRED_PLOT_PASSING = 50

interface Props {
  score: {
    score_in_type: number
    score_in_plot: number
  }
  setScore: Dispatch<
    SetStateAction<{
      score_in_type: number | null
      score_in_plot: number | null
    }>
  >
}

const ResultsModal: React.FC<Props> = ({ score, setScore }) => {
  const { theme } = useThemeStore()
  const { toggleResult, setToggleResult } = useToggleResult()
  const { blitzModeRecord, setBlitzModeRecord } = useGameStore()

  const handleResetScore = (): void => {
    if (blitzModeRecord) setBlitzModeRecord(0)
    setScore({ score_in_type: null, score_in_plot: null })
  }

  const getMotivationalMessage = (score: {
    score_in_type: number
    score_in_plot: number
  }): { message: string; color: string } => {
    if (score.score_in_type >= PRED_PASSING && score.score_in_plot >= PRED_PLOT_PASSING) {
      return { message: "Great job! You're becoming a stroke detection expert!", color: 'green' }
    }

    if (score.score_in_type < PRED_PASSING && score.score_in_plot >= PRED_PLOT_PASSING) {
      return {
        message: 'Keep studying stroke types! Try to identify key characteristics in the image.',
        color: 'yellow'
      }
    }

    if (score.score_in_plot < PRED_PLOT_PASSING && score.score_in_type >= PRED_PASSING) {
      return {
        message: 'Practice your lesion segmentation. Look for subtle changes in tissue density.',
        color: 'yellow'
      }
    }

    if (score.score_in_plot < PRED_PLOT_PASSING && score.score_in_type < PRED_PASSING) {
      return {
        message:
          'One step at a time. Keep studying stroke types! Try to identify key characteristics in the image and practice your lesion segmentation. Look for subtle changes in tissue density.',
        color: 'red'
      }
    }

    return { message: "You're making progress! Keep it up!", color: 'blue' }
  }

  const [toggleSlider] = useToggleSlider({
    barBackgroundColor: theme === 'dark' ? '#333333' : '#72FC5E',
    barBackgroundColorActive: theme === 'dark' ? '#72FC5E' : '#333333',
    barWidth: 80,
    barHeight: 40,
    handleSize: 30,
    handleBorderRadius: 100,
    handleBackgroundColor: theme === 'dark' ? '#72FC5E' : '#333333',
    handleBackgroundColorActive: theme === 'dark' ? '#333333' : '#72FC5E',
    transitionDuration: '200ms',
    active: toggleResult
  })

  return (
    <AnimatePresence>
      {(score?.score_in_type !== null || score?.score_in_plot !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`relative p-8 w-[90%] max-w-md rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-dark text-gray-100' : 'bg-white text-gray-800'
            }`}
          >
            <button
              onClick={handleResetScore}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <IoMdClose size={24} />
            </button>
            <h1
              className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} text-center font-medium text-md`}
            >
              Passing Score
            </h1>
            <div className="flex justify-between items-center gap-2 py-2">
              <div
                className={`w-full text-xs ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-dirty text-dark'} text-center py-2 rounded-md`}
              >
                <h1>
                  Stroke Identification: <span className="font-bold">50</span>
                </h1>
              </div>
              <div
                className={`w-full text-xs ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-dirty text-dark'} text-center py-2 rounded-md`}
              >
                <h1>
                  Stroke Segmentation: <span className="font-bold">30</span>
                </h1>
              </div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-dirty'} p-3 rounded-md`}>
              <h2 className="text-3xl font-bold text-center mb-6">Your Score</h2>
              {blitzModeRecord !== 0 && (
                <div
                  className={`w-full mb-4 p-4 rounded-lg text-center shadow-md ${
                    theme === 'dark' ? 'bg-gray_l text-teal-400' : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  <p className="text-lg font-medium">Blitz Mode Time</p>
                  <p className="text-2xl font-semibold">{formatTime(blitzModeRecord)}</p>
                </div>
              )}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-full p-4 rounded-lg text-center shadow-md ${
                    theme === 'dark' ? 'bg-gray_l text-teal-400' : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  <p className="text-lg font-medium">Stroke Type Guess Score</p>
                  <p className="text-2xl font-semibold">{score.score_in_type}</p>
                </div>
                <div
                  className={`w-full p-4 rounded-lg text-center shadow-md ${
                    theme === 'dark' ? 'bg-gray_l text-blue-400' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <p className="text-lg font-medium">Stroke Lesion Segmentation Score</p>
                  <p className="text-2xl font-semibold">{score.score_in_plot}</p>
                </div>
                <div
                  className={`w-full p-4 rounded-lg text-center ${
                    theme === 'dark' ? 'bg-gray_l ' : 'bg-yellow-50 '
                  }`}
                >
                  <p
                    className={`text-sm font-medium text-${getMotivationalMessage(score).color}-400`}
                  >
                    {getMotivationalMessage(score).message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex place-content-center gap-4 items-center py-2">
              <button
                onClick={() => {
                  setToggleResult(!toggleResult)
                }}
              >
                {toggleSlider}
              </button>
              <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'} `}>
                View Prediction Plot
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ResultsModal
