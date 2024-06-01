/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React from 'react'
import logo from '@/assets/logo.png'
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import { useThemeStore } from '@/store/theme'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { RiSettings5Fill } from 'react-icons/ri'
import { Tooltip } from '@chakra-ui/react'

/**
 * TODO: Fix the positioning of the Tooltip. It must be relative to its parent element.
 */

const Thumb: React.FC = () => {
  const { theme, setTheme } = useThemeStore()

  const LightsOnOrLightsOff = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff'
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#191919' : '#72FC5E'
        }
      }
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#72FC5E' : '#A5E69C',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          theme.palette.mode === 'dark' ? '#72FC5E' : '#191919'
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
      }
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#72FC5E' : '#191919',
      borderRadius: 20 / 2
    }
  }))

  const handleThemeToggle = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <div>
      <LightsOnOrLightsOff checked={theme === 'dark'} onChange={handleThemeToggle} />
    </div>
  )
}

const Navbar: React.FC = () => {
  const { theme } = useThemeStore()

  return (
    <div
      className={`flex justify-between items-center py-2 px-10 border-b ${theme === 'light' ? 'bg-white border-dirty' : 'bg-dark border-gray_l'} duration-150 font-main`}
    >
      <div className="flex gap-4 items-center">
        <img src={logo} alt="STELLA.ai Logo" className="w-7 h-auto" />
        <h1
          className={`text-md font-bold ${theme === 'light' ? 'text-dark' : 'text-light_g'} duration-150`}
        >
          STELLA.ai{' '}
          <span className="font-light text-italic">
            (Stroke Tomography for Enhanced Lesion Learning Analysis) v1.1
          </span>
        </h1>
      </div>
      <div
        className={`flex gap-4 items-center rounded-full py-2 px-3 ${theme === 'dark' ? 'bg-gray_l' : 'bg-dirty'}`}
      >
        {/* STELLA.ai is an undergraduate project
            made by students from Caraga State
            University to aid Radiologist for automated stroke lesion segmentation
            and classification. */}
        <div>
          <Tooltip
            label="STELLA.ai is an entry project for Hack4Health 2024. It is made by Team STELLA.ai from CarSU to aid Radiologist for automated stroke lesion segmentation and classification."
            placement="bottom"
            className={`rounded-md p-6 w-56 text-xs text-center ${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-light_g'}`}
          >
            <BsFillInfoCircleFill color={`${theme === 'dark' ? '#EFEFEF' : '#191919'}`} size={20} />
          </Tooltip>
        </div>
        <button className="cursor-pointer">
          <RiSettings5Fill color={`${theme === 'dark' ? '#EFEFEF' : '#191919'}`} size={20} />
        </button>
        <p className={`font-regular text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          Light Mode
        </p>
        <Thumb />
        <p className={`font-regular text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          Dark Mode
        </p>
      </div>
    </div>
  )
}

export default Navbar
