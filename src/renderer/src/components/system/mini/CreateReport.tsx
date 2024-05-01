/* eslint-disable prettier/prettier */
import React from 'react'
import { useThemeStore } from '@/store/theme'
import { HiOutlinePencilSquare } from 'react-icons/hi2'

/**
 * TODO: Create a modal that will allow the user to create a report based on the findings
 *
 * 1. The user can add a title to the report
 * 2. The user can add a description to the report
 * 3. The user can add a conclusion to the report
 * 4. The user can add a recommendation to the report
 * 5. The user can add a signature to the report
 * 6. The user can add a date to the report
 * 7. The user can download the report in a PDF format
 */

const CreateReport: React.FC = () => {
  const { theme } = useThemeStore()
  return (
    <div
      className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} rounded-lg flex flex-col gap-4 p-3`}
    >
      <div
        className={`rounded-lg w-full px-3 py-1 flex gap-4 items-center ${theme === 'dark' ? 'bg-sys_com' : 'bg-dirty'}`}
      >
        <div className="h-[20px] w-[5px] bg-light_g" />
        <h1 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} font-bold text-md`}>
          Report
        </h1>
      </div>
      <p className={`text-[10px] ${theme === 'dark' ? 'text-white' : 'text-dark'} text-left`}>
        After retrieving the results from the automated segmentation, you can now create a report or
        findings based on the segmentation results.
      </p>
      <button
        className={`py-2 rounded-lg text-center font-bold flex gap-4 place-content-center text-sm ${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-light_g'}`}
      >
        <HiOutlinePencilSquare size={20} />
        <h1>Create Report</h1>
      </button>
    </div>
  )
}

export default CreateReport
