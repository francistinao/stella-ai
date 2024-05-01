/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { Navbar } from '@/components/components'
import { useToolStore } from '@/store/tool'

//System components
import { Slider, Tools } from '@/components/system'

const System: React.FC = () => {
  const { tool_name } = useToolStore()

  // Need to improve and this will be applied on the CT Scan Canvas component
  //Temporary!
  //if the tool_name is grab then set the cursor to grab
  useEffect(() => {
    if (tool_name === 'Grab') {
      document.body.style.cursor = 'grab'

      //if mouse is down then set the cursor to grabbing
      document.body.onmousedown = () => {
        document.body.style.cursor = 'grabbing'
      }

      //if mouse is up then set the cursor to grab
      document.body.onmouseup = () => {
        document.body.style.cursor = 'grab'
      }
    } else {
      document.body.style.cursor = 'default'
    }
  }, [tool_name])

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      {/* Main layout */}
      <div className="pb-4 grid grid-cols-12">
        {/* CT Scan Sliders */}
        <div className="col-span-2">
          <Slider />
        </div>
        {/* Toolboxes and Image Config */}
        <div className="col-span-2">
          <Tools />
        </div>
        {/* CT Scan Canvas */}
        {/* Results */}
      </div>
    </div>
  )
}

export default System
