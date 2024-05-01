/* eslint-disable prettier/prettier */
import { TbLine } from 'react-icons/tb'
import { PiEye } from 'react-icons/pi'
import { FaRegHandPaper } from 'react-icons/fa'
import { BsRulers } from 'react-icons/bs'

export const tools = [
  {
    tool_id: 1,
    tool_name: 'Line',
    is_active: false,
    icon: <TbLine size={18} />
  },
  {
    tool_id: 2,
    tool_name: 'Show CT Scan',
    is_active: false,
    icon: <PiEye size={18} />
  },
  {
    tool_id: 3,
    tool_name: 'Grab',
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
