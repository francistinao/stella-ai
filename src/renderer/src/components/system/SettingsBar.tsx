/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import { useNavigate } from 'react-router-dom'
import { useResultStore, useCaptureStore } from '@/store/result'
import { useStoredImages } from '@/store/stored_images'
import { useGameStore } from '@/store/simulations'
import { useSliderStore } from '@/store/tool'

const SettingsBar: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { setResult, setNewResult, setResultToDisplay } = useResultStore()
  const { setSelectedImage } = useStoredImages()
  const { resetCapturedContent } = useCaptureStore()
  const { setBlitzModeRecord, setStartBlitzMode } = useGameStore()
  const { setToggleVisibilityFirst, setToggleVisibilitySecond } = useSliderStore()

  const reset = () => {
    setResult(null)
    setNewResult(null)
    setToggleVisibilityFirst(false)
    setToggleVisibilitySecond(true)
    setResultToDisplay(null)
    setBlitzModeRecord(0)
    setStartBlitzMode(false)
    setSelectedImage!(null)
    resetCapturedContent()
    navigate('/')
  }
  return (
    <div
      className={`px-5 w-full flex gap-x-2 items-start justify-start border-b ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} text-[10px] p-2`}
    >
      <button
        onClick={reset}
        className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'text-dirty hover:bg-gray_l duration-200' : 'text-dark hover:bg-dirty duration-100'}`}
      >
        Create New
      </button>

      <button
        className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'text-dirty hover:bg-gray_l duration-200' : 'text-dark hover:bg-dirty duration-100'}`}
      >
        Help
      </button>
    </div>
  )
}

export default SettingsBar
