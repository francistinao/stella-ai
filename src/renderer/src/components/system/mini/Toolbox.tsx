/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React from 'react'
import logo from '@/assets/logo.png'
import { useThemeStore } from '@/store/theme'
import { Tooltip } from '@chakra-ui/react'
import { useToolStore } from '@/store/tool'
import { useToggleSlider } from 'react-toggle-slider'
import { TbLine } from 'react-icons/tb'
import { PiEye, PiEyeClosed } from 'react-icons/pi'
import { FaRegHandPaper } from 'react-icons/fa'
import { BsRulers } from 'react-icons/bs'

interface ToolboxProps {
  observeWidth: number
}

const Toolbox: React.FC<ToolboxProps> = ({ observeWidth }) => {
  const { setToolName, setToolActivity, is_active } = useToolStore()

  const { theme } = useThemeStore()
  /**
   * TODO: The active state will be the main indicator for the detections to be displayed or not
   *
   * Create a global hook state later on to manage the state of the detections
   */

  const [toggleSlider, active] = useToggleSlider({
    barBackgroundColor: theme === 'dark' ? '#191919' : '#72FC5E',
    barBackgroundColorActive: theme === 'dark' ? '#72FC5E' : '#191919',
    barWidth: 80,
    barHeight: 40,
    handleSize: 30,
    handleBorderRadius: 100,
    handleBackgroundColor: theme === 'dark' ? '#72FC5E' : '#191919',
    handleBackgroundColorActive: theme === 'dark' ? '#191919' : '#72FC5E',
    transitionDuration: '200ms'
  })

  const tools = [
    {
      tool_id: 1,
      tool_name: 'Line',
      is_active: false,
      icon: <TbLine size={18} />
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
                }
              }}
              key={idx}
              className={`flex flex-col items-center gap-2 ${theme === 'dark' ? 'bg-light_g' : 'bg-dirty'}  text-dark py-2 px-4 rounded-md border border-zinc-500`}
            >
              {tool.icon}
            </button>
          </Tooltip>
        ))}
      </div>
      {/*  */}
      <div className="flex place-content-center gap-4 items-center">
        {toggleSlider}
        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          Display Segmentation
        </p>
      </div>
    </div>
  )
}

export default Toolbox
