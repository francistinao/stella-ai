/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import logo from '@/assets/logo.png'
import { useNoticeStore } from '@/store/theme'
import { data_persistence, docu, simu } from '@/data/updates'

const Notice: React.FC = () => {
  const { showNotice, setShowNotice } = useNoticeStore()
  const { theme } = useThemeStore()
  return (
    <AnimatePresence>
      {showNotice && (
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
            <div className="flex gap-6 items-center border-b border-gray_l pb-2">
              <img src={logo} alt="STELLA.ai Logo" className="w-14 h-14" />
              <h1 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} font-bold`}>
                STELLA.ai updates as of August 25, 2024
              </h1>
            </div>
            <div
              className={`max-h-[450px] overflow-y-auto customScroll flex flex-col gap-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            >
              <h1 className="font-bold text-3xl border-b border-gray_l pb-2">STELLA v1.1</h1>
              <h1 className="font-bold text-xl">
                STELLAMulator v1.0{' '}
                <span className="bg-light_g text-xs px-2 rounded-md font-bold text-dark relative bottom-3">
                  beta
                </span>
              </h1>
              <img src={simu} alt="Big Update" />

              <p className="text-xs">
                Introducing STELLAmulator, a groundbreaking feature designed for Radiologic
                Technologist Students. Experience efficient learning in stroke identification and
                classification through interactive assessments with STELLA's advanced model.
              </p>
              <p className="text-sm font-semibold">Expected Features in the STELLAmulation Beta:</p>
              <ul className="text-xs list-disc flex flex-col gap-2 px-5">
                <li>
                  <span className="font-semibold">Lesion Segmentation: </span>Students can practice
                  segmenting lesions on selected CT scans.
                </li>
                <li>
                  <span className="font-semibold">AI Assessment: </span>Receive instant feedback
                  from STELLA's AI model on segmentation and classification accuracy, aiding in
                  skill development.
                </li>
              </ul>
              <p className="text-xs">
                Unlock effective stroke detection training for Radiologic Students with
                STELLAmulation. Stay tuned for its upcoming release in the next versions of
                STELLA.ai.
              </p>
              <h1 className="font-bold text-xl">STELLA v1.0</h1>
              <p className="text-xs">
                STELLA.ai now offers enhanced database persistence, ensuring seamless access to
                recent CT scans uploads. Track the status and duration of CT scan uploads for better
                management and organization.
              </p>
              <img src={data_persistence} alt="First Update" />
              <h1 className="font-semibold text-xl">Radiologist Findings Modal</h1>
              <p className="text-xs">
                STELLA.ai can also add detections into the findings for report writing. The CT scan
                images will be included into the document once downloaded.
              </p>
              <img src={docu} alt="Big Update" />
            </div>
            <button
              onClick={() => {
                setShowNotice(false)
                sessionStorage.setItem('isShowAgain', 'false')
              }}
              className={`font-semibold ${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-light_g'} py-2 px-4 rounded-md`}
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Notice
