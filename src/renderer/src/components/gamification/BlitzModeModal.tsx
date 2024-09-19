/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/simulations'
import { useThemeStore } from '@/store/theme'
import logo from '@/assets/logo.png'
import { IoMdClose } from 'react-icons/io'

const BlitzModeModal: React.FC = () => {
  const { isBlitzMode, setStartBlitzMode, setIsBlitzMode } = useGameStore()
  const { theme } = useThemeStore()

  return (
    <AnimatePresence>
      {isBlitzMode && (
        <div
          className={`font-main fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              ease: [0, 0.71, 0.2, 0]
            }}
            className={`w-[650px] p-10 flex flex-col gap-4 absolute z-10 left-62 top-42 bg-blend-overlay shadow-2xl rounded-lg border ${theme === 'dark' ? 'bg-dark text-white border-zinc-700' : 'bg-white text-dark border-zinc-400'}`}
          >
            <div className="flex justify-between items-center border-b border-gray_l pb-2">
              <div className="flex gap-4 items-center">
                <img src={logo} alt="STELLA.ai Logo" className="w-14 h-14" />
                <h1
                  className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-2xl font-bold`}
                >
                  Blitz Mode
                </h1>
              </div>
              <button onClick={() => setIsBlitzMode(false)}>
                <IoMdClose
                  size={30}
                  className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                />
              </button>
            </div>

            {/**
             * 
             Instructions
             */}
            <p className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-left font-md`}>
              Assess the speed of your stroke detection and classification skills with Blitz Mode.
              This will time your assessment with the chosen CT Scan to evaluate the precision and
              speed of your diagnosis. Once start is clicked, the timer will begin.
            </p>
            <button
              onClick={() => {
                setStartBlitzMode(true)
                setIsBlitzMode(false)
              }}
              className={`${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-light_g'} font-semibold w-full rounded-md py-3`}
            >
              Start Blitz Mode!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BlitzModeModal
