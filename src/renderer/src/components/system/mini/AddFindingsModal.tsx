/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useResultStore } from '@/store/result'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '@/store/theme'
import { IoMdClose } from 'react-icons/io'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, ImageRun } from 'docx'
import { saveAs } from 'file-saver'

import { Toolbar } from '@/components/system/mini/index'

import { useCaptureStore } from '@/store/result'

const MyOnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const updateEditorState = () => {
      editor.getEditorState().read(() => {
        const editorState = editor.getEditorState()
        const text = editorState.toString()
        onChange(text)
      })
    }

    const unregister = editor.registerUpdateListener(updateEditorState)

    return () => unregister()
  }, [editor, onChange])

  return null
}

const AddFindingsModal: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAddFindings, setIsAddFindings } = useResultStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editorState, setEditorState] = useState<string | undefined>()
  const { capturedContent } = useCaptureStore()

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
    try {
      const imageRows: TableRow[] = []
      const capturedImages = [...capturedContent]

      while (capturedImages.length) {
        const rowCells: TableCell[] = []
        for (let i = 0; i < 3; i++) {
          if (capturedImages.length) {
            const dataUrl = capturedImages.shift()
            rowCells.push(
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: dataUrl || '',
                        transformation: {
                          width: 700,
                          height: 700
                        }
                      })
                    ]
                  })
                ],
                width: { size: 60, type: WidthType.PERCENTAGE }
              })
            )
          } else {
            rowCells.push(new TableCell({ children: [] }))
          }
        }
        imageRows.push(new TableRow({ children: rowCells }))
      }

      if (imageRows.length === 0) {
        throw new Error('No image rows were created, check the images array.')
      }

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: 'Radiologist Report',
                heading: 'Heading1'
              }),
              new Table({
                rows: imageRows
              }),
              new Paragraph({
                text: editorState?.toString() || '',
                spacing: { before: 400, after: 400 }
              })
            ]
          }
        ]
      })

      const buffer = await Packer.toBlob(doc)
      saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }),
        'report.docx'
      )
    } catch (err) {
      console.error('Error generating DOCX file:', err)
    }
  }

  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = capturedContent.length

  useEffect(() => {
    if (totalSlides > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
      }, 4000)

      return () => clearInterval(interval)
    }

    return
  }, [totalSlides])

  return (
    <AnimatePresence>
      {isAddFindings && (
        <div
          className={`font-main fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50`}
        >
          <div className="flex gap-10">
            {totalSlides > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.5,
                  type: 'spring',
                  ease: [0, 0.71, 0.2, 0]
                }}
                className={`relative py-10 flex flex-col gap-4 bg-blend-overlay shadow-2xl rounded-lg p-6 w-[600px] border ${
                  theme === 'dark'
                    ? ' bg-dark text-white border-zinc-700'
                    : 'bg-white text-dark border-dirty'
                }`}
              >
                <h1 className="text-center font-bold text-3xl">Detections</h1>
                <div className="relative w-full h-full overflow-hidden">
                  <AnimatePresence>
                    {capturedContent.map(
                      (content, idx) =>
                        idx === currentSlide && (
                          <motion.div
                            key={idx}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0, x: '-100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ duration: 0.5 }}
                          >
                            <img
                              src={content}
                              alt={`Captured image ${idx}`}
                              className="object-cover w-[1200px] h-[1200px]"
                            />
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                ease: [0, 0.71, 0.2, 0]
              }}
              className={`relative p-10 flex flex-col gap-4 bg-blend-overlay shadow-2xl rounded-lg w-[600px] border ${
                theme === 'dark'
                  ? ' bg-dark text-white border-zinc-700'
                  : 'bg-white text-dark border-dirty'
              } shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Create Findings</h1>
                <button onClick={() => setIsAddFindings!(false)}>
                  <IoMdClose size={25} />
                </button>
              </div>

              <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
                <RichTextPlugin contentEditable={<ContentEditable />} />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <MyOnChangePlugin onChange={onChange} />
              </LexicalComposer>
              <button
                onClick={downloadDocx}
                className={`mt-4 p-2 rounded ${theme === 'dark' ? 'bg-light_g text-dark' : 'bg-dark text-light_g'}`}
              >
                Download as DOCX
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddFindingsModal
