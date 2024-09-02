/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */

//NEED TO FIX
import React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection
} from 'lexical'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaArrowsAltV
} from 'react-icons/fa'

const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const applyStyle = (command) => {
    editor.dispatchCommand(command, undefined)
  }

  const applyElementStyle = (command, value) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          //eslint-disable-next-line
          //@ts-ignore
          node.setStyle(command, value)
        })
      }
    })
  }

  return (
    <div className="flex gap-2 border-b border-gray-300 p-2 mb-2">
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_TEXT_COMMAND.BOLD)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaBold />
      </button>
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_TEXT_COMMAND.ITALIC)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaItalic />
      </button>
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_TEXT_COMMAND.UNDERLINE)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaUnderline />
      </button>
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_ELEMENT_COMMAND.ALIGN_LEFT)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaAlignLeft />
      </button>
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_ELEMENT_COMMAND.ALIGN_CENTER)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaAlignCenter />
      </button>
      <button
        //eslint-disable-next-line
        //@ts-ignore
        onClick={() => applyStyle(FORMAT_ELEMENT_COMMAND.ALIGN_RIGHT)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => applyElementStyle('lineHeight', '1.5')}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaArrowsAltV /> 1.5
      </button>
      <button
        onClick={() => applyElementStyle('lineHeight', '2')}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <FaArrowsAltV /> 2
      </button>
    </div>
  )
}

export default Toolbar
