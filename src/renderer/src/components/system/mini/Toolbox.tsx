/* eslint-disable prettier/prettier */
import React from 'react'
import logo from '@/assets/logo.png'
import { useThemeStore } from '@/store/theme'
import { tools } from '@/data/tools'
import { Tooltip } from '@chakra-ui/react'
import { useToolStore } from '@/store/tool'

const Toolbox: React.FC = () => {
  const { setToolName } = useToolStore()
  const { theme } = useThemeStore()
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
          className={`flex gap-4 items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-full py-2 pl-4`}
        >
          <div className="h-[20px] w-[5px] bg-light_g" />
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} font-bold text-[13px]`}>
            STELLA.ai Toolbox
          </h1>
        </div>
      </div>
      {/* Tools */}
      <div
        className={`grid grid-cols-4 gap-2 rounded-full py-2 px-4 items-center justify-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
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
              onClick={() => setToolName(tool.tool_name)}
              key={idx}
              className={`flex flex-col items-center gap-2 ${theme === 'dark' ? 'bg-light_g' : 'bg-dirty'}  text-dark py-2 px-4 rounded-md border border-zinc-500`}
            >
              {tool.icon}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default Toolbox
