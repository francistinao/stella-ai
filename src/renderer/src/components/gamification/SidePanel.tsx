/* eslint-disable prettier/prettier */
import React from 'react'
import logo from '@/assets/logo.png'
import { useThemeStore } from '@/store/theme'

const SidePanel: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`w-[500px] m-3 rounded-md ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'} flex flex-col gap-4 p-3`}
    >
      <div className="flex w-full gap-4 items-center">
        <div
          className={`border-2 ${theme === 'dark' ? 'bg-dark border-gray_l' : 'bg-white border-dirty'} rounded-full`}
        >
          <img src={logo} alt="logo" className="w-12 h-10" />
        </div>
        <div
          className={`w-full flex gap-4 items-center ${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-full py-2 pl-4`}
        >
          <div className="h-[20px] w-[5px] bg-light_g" />
          <h1 className={`${theme === 'dark' ? 'text-dirty' : 'text-dark'} font-bold text-[13px]`}>
            STELLAmulator
          </h1>
        </div>
      </div>
    </div>
  )
}

export default SidePanel
