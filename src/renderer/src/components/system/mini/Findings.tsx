/* eslint-disable prettier/prettier */
/* eslint-disable-next-line */
import React, { useState } from 'react'
import { useThemeStore } from '@/store/theme'
import { MdKeyboardArrowDown } from 'react-icons/md'
import logo from '@/assets/logo.png'
import { motion } from 'framer-motion'
import { useStoredImages } from '@/store/stored_images'
import mascot from '@/assets/mascot.png'
import mascot_head from '@/assets/logo.png'
import { useResultStore, useCaptureStore } from '@/store/result'

const Findings: React.FC = () => {
  const { newResult } = useResultStore()
  const { isLoading } = useStoredImages()
  const [isStrokeFindingsFindingsDrop, setIsStrokeFindingsDrop] = useState(true)
  const [isLesionBoundaryDrop, setIsLesionBoundaryDrop] = useState(false)
  const { theme } = useThemeStore()
  const { setIsCapture } = useCaptureStore()

  return (
    <div
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-[#797979]'} rounded-lg flex flex-col gap-4 p-3`}
    >
      <div
        className={`rounded-full w-full px-3 py-1 flex gap-2 items-center ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'}`}
      >
        <img src={logo} className="w-10" alt="STELLA.ai Logo" />
        <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold text-xs`}>
          Screening Results
        </h1>
      </div>
      {/* Stroke findings */}
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="text-sm font-semibold">Stroke Findings</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isStrokeFindingsFindingsDrop ? 180 : 0 }}
            onClick={() => setIsStrokeFindingsDrop(!isStrokeFindingsFindingsDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isStrokeFindingsFindingsDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-2"
        >
          {!isLoading && !newResult?.stroke_type && (
            <div className="flex flex-col gap-4 justify-center place-items-center">
              <motion.img
                animate={{ y: [-10, 10, -10], transition: { duration: 1.5, repeat: Infinity } }}
                src={mascot}
                alt="STELLA.ai Mascot"
                className="w-64 h-auto"
              />
              <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold`}>
                Start Segmentate
              </h1>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col gap-4 justify-center place-items-center">
              <motion.img
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [0, 10, 20, 10, 0],
                  transition: { duration: 2.5, repeat: Infinity }
                }}
                src={mascot_head}
                alt="STELLA.ai Mascot"
                className="w-24 h-auto"
              />
              <h1 className={`${theme === 'dark' ? 'text-light_g' : 'text-dark'} font-semibold`}>
                Detecting Lesions...
              </h1>
            </div>
          )}

          {!isLoading ? (
            typeof newResult?.stroke_type === 'string' &&
            newResult.stroke_type !== '' &&
            (newResult.stroke_type === 'Ischemic Stroke' ||
              newResult.stroke_type === 'Hemorrhagic Stroke' ||
              newResult.stroke_type !== 'No relevant strokes detected') ? (
              <>
                <div
                  className={`flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">{newResult.stroke_type}</p>
                    <p className="text-[10px] font-regular">
                      Houndsfield Value:{' '}
                      <span className="font-bold">{newResult?.lesion_boundary_points.Mean}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <h1
                        className={`text-[10px] ${theme === 'dark' ? 'text-light_g' : 'text-dark'}`}
                      >
                        Lesion Area in pixels
                      </h1>
                      <h1
                        className={`text-[12px] ${theme === 'dark' ? 'text-white' : 'text-dark'} font-semibold`}
                      >
                        {newResult?.lesion_boundary_points?.Area}
                      </h1>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCapture(true)
                  }}
                  className={`font-semibold text-xs border-2 ${theme === 'dark' ? 'bg-gray_l text-white border-zinc-700' : 'bg-white border-zinc-300 text-black'} rounded-full text-center py-2 w-full mt-4`}
                >
                  Add detection to findings
                </button>
              </>
            ) : (
              <>
                <div
                  className={`flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">{newResult?.stroke_type}</p>
                  </div>
                </div>
              </>
            )
          ) : (
            <></>
          )}
        </motion.div>
      </div>

      {/* End of stroke findings */}
      {/* Lesion boundary points */}
      <div
        className={`${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} p-4 rounded-lg flex flex-col`}
      >
        <div
          className={`pb-2 border-b flex justify-between items-center  ${theme === 'dark' ? 'border-gray_l' : 'border-dirty'}`}
        >
          <div
            className={`${theme === 'dark' ? 'text-light_g ' : 'text-dark'} flex gap-3 items-center`}
          >
            <h1 className="font-semibold text-xs">Lesion Boundary Points</h1>
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
          className="overflow-hidden py-2 max-h-[100px] overflow-y-auto customScroll"
        >
          <div
            className={`w-full flex flex-col gap-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            {/* map the temp boundary points  */}
            <div className="grid grid-cols-4 gap-2">
              {newResult?.lesion_boundary_points?.Lesion_Boundary_Points?.map((point, idx) => (
                <div
                  key={idx}
                  className={`justify-between items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-2 rounded-lg`}
                >
                  <h1 className="text-xs font-regular">
                    X: {point[0]}, Y: {point[1]}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Findings
