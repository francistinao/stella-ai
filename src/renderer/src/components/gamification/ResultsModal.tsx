/* eslint-disable prettier/prettier */
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'
import { useToggleResult } from '@/store/simulations'
import { useToggleSlider } from 'react-toggle-slider'

const PRED_PASSING = 15
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

  const handleResetScore = (): void => {
    setScore({ score_in_type: null, score_in_plot: null })
  }

  const motivationalMessage = useMemo(() => {
    const messages: string[] = []
    if (score.score_in_type < PRED_PASSING) {
      messages.push('Keep studying stroke types! Try to identify key characteristics in the image.')
    }
    if (score.score_in_plot < PRED_PLOT_PASSING) {
      messages.push(
        'Practice your lesion identification. Look for subtle changes in tissue density.'
      )
    }
    if (score.score_in_type >= PRED_PASSING && score.score_in_plot >= PRED_PLOT_PASSING) {
      return "Great job! You're becoming a stroke detection expert!"
    }
    return messages.join(' ') + ' Remember, precision is key in stroke diagnosis!'
  }, [score])

  const [toggleSlider] = useToggleSlider({
    barBackgroundColor: theme === 'dark' ? '#191919' : '#72FC5E',
    barBackgroundColorActive: theme === 'dark' ? '#72FC5E' : '#191919',
    barWidth: 80,
    barHeight: 40,
    handleSize: 30,
    handleBorderRadius: 100,
    handleBackgroundColor: theme === 'dark' ? '#72FC5E' : '#191919',
    handleBackgroundColorActive: theme === 'dark' ? '#191919' : '#72FC5E',
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
            <h2 className="text-3xl font-bold text-center mb-6">Your Score</h2>
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
              {/* Add the motivational message */}
              <div
                className={`w-full p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray_l text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                <p className="text-sm font-medium">{motivationalMessage}</p>
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
