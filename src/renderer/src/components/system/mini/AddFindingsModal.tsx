/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useResultStore } from '@/store/result'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'
import { $getRoot } from 'lexical'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph } from 'docx'

import { Toolbar } from '@/components/system/mini/index'

const MyOnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState)
    })
  }, [editor, onChange])
  return null
}

const AddFindingsModal: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAddFindings, setIsAddFindings } = useResultStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editorState, setEditorState] = useState()

  const onChange = (editorState) => {
    setEditorState(editorState)
  }

  const onError = (error) => {
    console.error(error)
  }

  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      paragraph: 'paragraph',
      placeholder: 'placeholder',
      text: {
        bold: 'text-bold',
        italic: 'text-italic',
        underline: 'text-underline'
      },
      root: 'lexicalEditor'
    },
    onError
  }

  const downloadDocx = async () => {
    const doc = new Document({
      sections: []
    })
    const root = $getRoot()
    const paragraphs = root.getChildren()
    const docParagraphs = paragraphs.map((paragraphNode) => {
      const textContent = paragraphNode.getTextContent()
      return new Paragraph(textContent)
    })

    doc.addSection({
      children: docParagraphs
    })

    const buffer = await Packer.toBuffer(doc)
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    saveAs(blob, 'document.docx')
  }

  return (
    <AnimatePresence>
      {isAddFindings && (
        <div
          className={`font-main fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              ease: [0, 0.71, 0.2, 0]
            }}
            className={`p-10 flex flex-col gap-4 absolute z-10 left-62 top-42 bg-blend-overlay shadow-2xl rounded-lg w-[600px] border ${theme === 'dark' ? 'bg-white text-dark border-dirty' : 'bg-dark text-white border-zinc-500'}`}
          >
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl">Create Findings</h1>
              <button onClick={() => setIsAddFindings!(false)}>
                <IoMdClose size={25} />
              </button>
            </div>
            <LexicalComposer initialConfig={initialConfig}>
              <Toolbar />
              <RichTextPlugin contentEditable={<ContentEditable />} />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <MyOnChangePlugin onChange={onChange} />
            </LexicalComposer>
            <button onClick={downloadDocx} className="mt-4 p-2 bg-dark text-light_g rounded">
              Download as DOCX
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddFindingsModal
