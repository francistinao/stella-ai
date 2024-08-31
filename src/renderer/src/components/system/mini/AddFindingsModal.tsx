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

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  ImageRun,
  AlignmentType,
  BorderStyle,
  TextRun
} from 'docx'
import { saveAs } from 'file-saver'

import { Toolbar } from '@/components/system/mini/index'

import { useCaptureStore } from '@/store/result'
import { $getRoot } from 'lexical'

const MyOnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const updateEditorState = () => {
      editor.getEditorState().read(() => {
        const root = $getRoot()
        const plainText = root.getTextContent()
        onChange(plainText)
      })
    }

    return () => updateEditorState()
  }, [editor, onChange])

  return null
}

const AddFindingsModal: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAddFindings, setIsAddFindings } = useResultStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editorState, setEditorState] = useState('')
  const { capturedContent } = useCaptureStore()

  const onChange = (text: string) => {
    setEditorState(text)
  }

  const onError = (error: Error) => {
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

  const cropImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = dataUrl as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const { width, height } = imageData

        let minX = width,
          minY = height,
          maxX = 0,
          maxY = 0

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = imageData.data[(y * width + x) * 4 + 3]
            if (alpha > 0) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
            }
          }
        }

        const cropWidth = maxX - minX + 1
        const cropHeight = maxY - minY + 1

        canvas.width = cropWidth
        canvas.height = cropHeight

        ctx.drawImage(img, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        resolve(canvas.toDataURL())
      }
    })
  }

  const downloadDocx = async () => {
    try {
      const imageRows: TableRow[] = []
      const capturedImages = [...capturedContent]

      const containerWidth = 300
      const containerHeight = 300

      while (capturedImages.length) {
        const rowCells: TableCell[] = []
        for (let i = 0; i < 2; i++) {
          if (capturedImages.length) {
            const dataUrl = capturedImages.shift()
            const croppedImageUrl = await cropImage(dataUrl as string)

            rowCells.push(
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    indent: { left: 0, right: 0 },
                    children: [
                      new ImageRun({
                        data: croppedImageUrl || '',
                        transformation: {
                          width: containerWidth,
                          height: containerHeight
                        }
                      })
                    ]
                  })
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
                },
                margins: { top: 0, bottom: 0, left: 0, right: 0 }
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

      const combinedDoc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: 'Radiologist Findings',
                alignment: AlignmentType.CENTER,
                heading: 'Heading1'
              }),
              new Table({
                rows: imageRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                margins: { top: 8, bottom: 8, left: 0, right: 0 },
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: editorState,
                    font: {
                      name: 'Arial'
                    },
                    size: 24
                  })
                ],
                alignment: AlignmentType.LEFT
              })
            ]
          }
        ]
      })

      const buffer = await Packer.toBlob(combinedDoc)
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
