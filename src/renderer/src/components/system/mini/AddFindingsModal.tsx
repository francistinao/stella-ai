/* eslint-disable prettier/prettier */
import React from 'react'
import { useResultStore } from '@/store/result'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '@/store/theme'

const AddFindingsModal: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAddFindings } = useResultStore()
  return (
    <AnimatePresence>
      {isAddFindings && (
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
            className={`p-10 flex flex-col gap-4 absolute z-10 left-62 top-42 bg-blend-overlay shadow-2xl rounded-lg border ${theme === 'dark' ? 'bg-white text-dark border-dirty' : 'bg-dark text-white border-zinc-500'}`}
          >
            <h1>Hello</h1>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddFindingsModal
