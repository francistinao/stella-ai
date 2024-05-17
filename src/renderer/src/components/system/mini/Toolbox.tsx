/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import logo from '@/assets/logo.png'
import { useThemeStore } from '@/store/theme'
import { Tooltip } from '@chakra-ui/react'
import { useToolStore } from '@/store/tool'
import { useToggleSlider } from 'react-toggle-slider'
import { PiEye, PiEyeClosed } from 'react-icons/pi'
import { FaRegHandPaper } from 'react-icons/fa'
import { BsRulers } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { useVisible } from '@/store/visible'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

interface ToolboxProps {
  observeWidth: number
}

const Toolbox: React.FC<ToolboxProps> = ({ observeWidth }) => {
  const { setBoundaryColor, setBoundarySize, boundarySize, tool_name, setToolName, setToolActivity, is_active, setIsDraw, is_draw } = useToolStore()
  const { setVisible, visible } = useVisible()

  const { theme } = useThemeStore()

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

  const colorChoices = [
    {
      color: "#78b6f2",
      rgb_val: "rgb(120, 182, 242, 0.2)"
    },
    {
      color:  "#b365e8",
      rgb_val: "rgb(179, 101, 232, 0.2)"
    },
    {
      color: "#72e3d1",
      rgb_val: "rgb(114, 227, 209, 0.2)"
    },
    {
      color: "#92ea8e",
      rgb_val: "rgb(146, 234, 142, 0.2)"
    },
    {
      color: "#f2d34c",
      rgb_val: "rgb(242, 211, 76, 0.2)"
    }
  ]

  const [toggleSlider, active] = useToggleSlider({
      barBackgroundColor: theme === 'dark' ? '#191919' : '#72FC5E',
      barBackgroundColorActive: theme === 'dark' ? '#72FC5E' : '#191919',
      barWidth: 80,
      barHeight: 40,
      handleSize: 30,
      handleBorderRadius: 100,
      handleBackgroundColor: theme === 'dark' ? '#72FC5E' : '#191919',
      handleBackgroundColorActive: theme === 'dark' ? '#191919' : '#72FC5E',
      transitionDuration: '200ms',
      active: visible
    },
  )

  const tools = [
    {
      tool_id: 1,
      tool_name: 'Pencil (Shortcut: P)',
      is_draw: false,
      icon: <BiPencil size={18} />
    },
    {
      tool_id: 2,
      tool_name: is_active ? 'Hide CT Scan (Shortcut: C)' : 'Show CT Scan (Shortcut: C)',
      is_active: false,
      icon: is_active ? <PiEye size={18} /> : <PiEyeClosed size={18} />
    },
    {
      tool_id: 3,
      tool_name: 'Grab (Shortcut: H)',
      is_active: false,
      icon: <FaRegHandPaper size={18} />
    },
    {
      tool_id: 4,
      tool_name: 'Ruler',
      is_active: false,
      icon: <BsRulers size={18} />
    }
  ]

  const handleBoundaryPointsSize = (_event: Event, newValue: number | number[]) => {
    setBoundarySize!(newValue as number)
  }
  return (
    <div
      className={`m-3 rounded-md ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} flex flex-col gap-4 p-3`}
    >
      <div className="flex w-full gap-4 items-center">
        <div
          className={`border-2 ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} rounded-full`}
        >
          <img src={logo} alt="logo" className="w-10 h-10" />
        </div>
        <div
          className={`w-full flex gap-4 items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-full py-2 pl-4`}
        >
          <div className="h-[20px] w-[5px] bg-light_g" />
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} font-bold text-[13px]`}>
            STELLA.ai Toolbox
          </h1>
        </div>
      </div>
      {/* Tools */}
      <div
        className={` ${observeWidth > 290 ? 'flex gap-2' : 'grid grid-cols-4 px-4'} gap-2 rounded-full py-2  items-center justify-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
      >
        {tools.map((tool, idx) => (
          <Tooltip
            key={idx}
            label={tool.tool_name}
            hasArrow
            placement="bottom"
            className={`${theme === 'dark' ? 'bg-light_g' : 'bg-dirty'} text-dark text-[12px] rounded-md p-1`}
          >
            <button
              onClick={() => {
                setToolName(tool.tool_name)
                if (tool.tool_name === 'Show CT Scan' || tool.tool_id === 2) {
                  setToolActivity(!is_active)
                } else if (tool.tool_name === 'Line' || tool.tool_id === 1) {
                  setIsDraw(!is_draw)
                }
              }}
              key={idx}
              className={`flex flex-col items-center gap-2 ${theme === 'dark' ? 'bg-light_g' : 'bg-dirty'} ${tool_name.includes(tool.tool_name) && (theme === 'dark' ? 'border-[3.5px] border-[#46856e] duration-50h' : 'border-[3.5px] border-dark duration-50h')} text-dark py-2 px-4 rounded-md `}
            >
              {tool.icon}
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-xs`}>Boundary Points Color</h1>
        <div className="grid grid-cols-5 gap-2">
          {colorChoices.map((color, idx) => (
            <button
              onClick={() => setBoundaryColor!(color)}
              key={idx}
              className={`rounded-sm h-10 w-10 ${theme === 'dark' ? 'bg-light_g' : 'bg-dirty'}`}
              style={{ backgroundColor: color.color }}
            />
          ))}
       </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-xs`}>Boundary Points Size</h1>
        <PrettoSlider
          onChange={handleBoundaryPointsSize}
          valueLabelDisplay="auto"
          defaultValue={boundarySize}
          min={0}
          max={12}
        />
      </div>
      <div className="flex place-content-center gap-4 items-center">
        <button 
          onClick={() => setVisible(!visible)}>
          {toggleSlider}
        </button>
        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          Display Segmentation
        </p>
      </div>
    </div>
  )
}

export default Toolbox
