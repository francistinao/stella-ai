/* eslint-disable prettier/prettier */
import React, { Dispatch, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCoordStore } from '@/store/simulations'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'

interface Props {
  score: {
    score_in_type: number
    score_in_plot: number
  }
  setScore: Dispatch<
    SetStateAction<{
      score_in_type: number
      score_in_plot: number
    }>
  >
}

const ResultsModal: React.FC<Props> = ({ score, setScore }) => {
  const { theme } = useThemeStore()
  const { coord, setCoord } = useCoordStore()

  const handleResetScore = (): void => {
    setScore({ score_in_type: 0, score_in_plot: 0 })

    if (coord) {
      setCoord([])
    }
  }

  return (
    <AnimatePresence>
      {(score?.score_in_type !== 0 || score?.score_in_plot !== 0) && (
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ResultsModal
