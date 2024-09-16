/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useThemeStore } from '@/store/theme'
import { motion } from 'framer-motion'
import { IoMdContrast } from 'react-icons/io'
import { IoMdSunny } from 'react-icons/io'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { HiAdjustmentsHorizontal } from 'react-icons/hi2'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import { useImageConfigStore } from '@/store/tool'
import { useToggleSlider } from 'react-toggle-slider'
import { useEffect } from 'react'

/**
 * TODO: Create a global state for storing the following:
 *
 * Contrast level
 * Highlights amount
 * Highlights Tone
 * Shadows amount
 * Shadows Radius
 * @returns
 */
const ImageConfig: React.FC = () => {
  const [isContrastDrop, setIsContrastDrop] = useState(true)
  const [isHighlightDrop, setIsHighlightDrop] = useState(true)
  const [isShadowDrop, setIsShadowDrop] = useState(false)
  const { theme } = useThemeStore()
  const {
    contrastLevel,
    highlightsAmount,
    sepia,
    setContrastLevel,
    setHighlightsAmount,
    setSepia,
    setIsInvert
  } = useImageConfigStore()

  const [toggleSlider, active] = useToggleSlider({
    barBackgroundColor: theme === 'dark' ? '#333333' : '#72FC5E',
    barBackgroundColorActive: theme === 'dark' ? '#72FC5E' : '#333333',
    barWidth: 80,
    barHeight: 40,
    handleSize: 30,
    handleBorderRadius: 100,
    handleBackgroundColor: theme === 'dark' ? '#72FC5E' : '#333333',
    handleBackgroundColorActive: theme === 'dark' ? '#333333' : '#72FC5E',
    transitionDuration: '200ms'
  })

  const PrettoSlider = styled(Slider)({
    color: theme === 'dark' ? '#72FC5E' : '#191919',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none'
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit'
      },
      '&::before': {
        display: 'none'
      }
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: theme === 'dark' ? '#72FC5E' : '#191919',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&::before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
      },
      '& > *': {
        transform: 'rotate(45deg)'
      }
    }
  })

  const handleContrastLevel = (_event: Event, newValue: number | number[]) => {
    setContrastLevel(newValue as number)
  }

  const handleHighlightsAmount = (_event: Event, newValue: number | number[]) => {
    setHighlightsAmount(newValue as number)
  }

  const handleSepia = (_event: Event, newValue: number | number[]) => {
    setSepia(newValue as number)
  }

  useEffect(() => {
    if (active) {
      setIsInvert(1)
    } else {
      setIsInvert(0)
    }
  }, [active])

  return (
    <div
      className={`mx-3 mt-3 mb-8 rounded-md ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} flex flex-col gap-4 px-3 py-3 pb-6 max-h-[320px] overflow-y-auto customScroll`}
    >
      <div
        className={`flex gap-4 items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-full py-2 pl-4`}
      >
        <div className="h-[20px] w-[5px] bg-light_g" />
        <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} font-bold text-[13px]`}>
          Image Configuration
        </h1>
      </div>
      {/* Contrast Component */}
      <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-4 rounded-md flex flex-col`}>
        <div className="flex justify-between items-center">
          <div
            className={`${theme === 'dark' ? 'text-white' : 'text-dark'} flex gap-3 items-center`}
          >
            <IoMdContrast size={20} />
            <h1 className="font-semibold text-sm">Contrast</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isContrastDrop ? 180 : 0 }}
            onClick={() => setIsContrastDrop(!isContrastDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isContrastDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-5"
        >
          <div
            className={`flex flex-col text-xs gap-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            <div className="flex justify-between items-center">
              <h1>Contrast Level</h1>
              <h1>{contrastLevel}%</h1>
            </div>
            <PrettoSlider
              onChange={handleContrastLevel}
              valueLabelDisplay="auto"
              defaultValue={contrastLevel}
              min={0}
              max={100}
            />
          </div>
        </motion.div>
      </div>
      {/* End of Contrast Component */}
      {/*  Highlights Component*/}
      <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-4 rounded-md flex flex-col`}>
        <div className="flex justify-between items-center ">
          <div
            className={`${theme === 'dark' ? 'text-white' : 'text-dark'} flex gap-3 items-center`}
          >
            <IoMdSunny size={20} />
            <h1 className="font-semibold text-sm">Highlights</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isHighlightDrop ? 180 : 0 }}
            onClick={() => setIsHighlightDrop(!isHighlightDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isHighlightDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-5"
        >
          <div
            className={`flex flex-col text-xs gap-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            <div className="flex justify-between items-center">
              <h1>Amount</h1>
              <h1>{highlightsAmount}%</h1>
            </div>
            <PrettoSlider
              onChange={handleHighlightsAmount}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={highlightsAmount}
              max={4}
            />
          </div>
        </motion.div>
      </div>
      {/* End of Highlights component */}
      {/* Shadows Component */}
      <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} p-4 rounded-md flex flex-col`}>
        <div className="flex justify-between items-center ">
          <div
            className={`${theme === 'dark' ? 'text-white' : 'text-dark'} flex gap-3 items-center`}
          >
            <HiAdjustmentsHorizontal size={20} />
            <h1 className="font-semibold text-sm">Adjustments</h1>
          </div>
          <motion.button
            initial={{ rotate: 0 }}
            animate={{ rotate: isShadowDrop ? 180 : 0 }}
            onClick={() => setIsShadowDrop(!isShadowDrop)}
          >
            <MdKeyboardArrowDown
              size={20}
              className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            />
          </motion.button>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isShadowDrop ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pt-5"
        >
          <div
            className={`flex flex-col text-xs gap-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
          >
            {/* Need to change the setting for this one, I don't know what to add yet */}
            <div className="flex justify-between items-center">
              <h1>Sepia</h1>
              <h1>{sepia}%</h1>
            </div>
            <PrettoSlider
              onChange={handleSepia}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={sepia}
              min={0}
              max={1}
            />
          </div>
          <div className="flex justify-between items-center">
            {toggleSlider}
            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Invert</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ImageConfig
