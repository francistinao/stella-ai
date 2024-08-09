/* eslint-disable prettier/prettier */
import React, { useState, useEffect, forwardRef } from 'react'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import MenuIcon from '@mui/icons-material/Menu'
import ContrastIcon from '@mui/icons-material/Contrast'
import SearchIcon from '@mui/icons-material/Search'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import StraightenIcon from '@mui/icons-material/Straighten'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Slide from '@mui/material/Slide'
import Toolbar from '@mui/material/Toolbar'
import TagsTable from './TagsTable'
import { App, getDwvVersion, decoderScripts } from 'dwv'
import '@/assets/DwvComponent.css'

decoderScripts.jpeg2000 = `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpeg2000.js`
decoderScripts['jpeg-lossless'] =
  `${process.env.PUBLIC_URL}/assets/dwv/decoders/rii-mango/decode-jpegloss.js`
decoderScripts['jpeg-baseline'] =
  `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpegbaseline.js`
decoderScripts.rle = `${process.env.PUBLIC_URL}/assets/dwv/decoders/dwv/decode-rle.js`

interface DwvComponentProps {}

interface DwvComponentState {
  versions: { dwv: string; react: string }
  tools: {
    [key: string]: {
      options?: string[]
    }
  }
  selectedTool: string
  loadProgress: number
  dataLoaded: boolean
  dwvApp: App | null
  metaData: Record<string, unknown>
  orientation?: string
  showDicomTags: boolean
  dropboxDivId: string
  dropboxClassName: string
  borderClassName: string
  hoverClassName: string
}

const TransitionUp = forwardRef(function TransitionUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DwvComponent: React.FC<DwvComponentProps> = () => {
  const [state, setState] = useState<DwvComponentState>({
    versions: {
      dwv: getDwvVersion(),
      react: React.version
    },
    tools: {
      Scroll: {},
      ZoomAndPan: {},
      WindowLevel: {},
      Draw: {
        options: ['Ruler']
      }
    },
    selectedTool: 'Select Tool',
    loadProgress: 0,
    dataLoaded: false,
    dwvApp: null,
    metaData: {},
    orientation: undefined,
    showDicomTags: false,
    dropboxDivId: 'dropBox',
    dropboxClassName: 'dropBox',
    borderClassName: 'dropBoxBorder',
    hoverClassName: 'hover'
  })

  const theme = useTheme()

  useEffect(() => {
    const app = new App()
    app.init({
      dataViewConfigs: { '*': [{ divId: 'layerGroup0' }] },
      tools: state.tools
    })

    let nLoadItem: number | null = null
    let nReceivedLoadError: number | null = null
    let nReceivedLoadAbort: number | null = null
    let isFirstRender: boolean | null = null

    app.addEventListener('loadstart', () => {
      nLoadItem = 0
      nReceivedLoadError = 0
      nReceivedLoadAbort = 0
      isFirstRender = true
      showDropbox(app, false)
    })

    app.addEventListener('loadprogress', (event) => {
      setState((prevState) => ({
        ...prevState,
        loadProgress: event.loaded
      }))
    })

    app.addEventListener('renderend', () => {
      if (isFirstRender) {
        isFirstRender = false
        let selectedTool = 'ZoomAndPan'
        if (app.canScroll()) {
          selectedTool = 'Scroll'
        }
        onChangeTool(selectedTool)
      }
    })

    app.addEventListener('load', (event) => {
      setState((prevState) => ({
        ...prevState,
        metaData: app.getMetaData(event.dataid),
        dataLoaded: true
      }))
    })

    app.addEventListener('loadend', () => {
      if (nReceivedLoadError) {
        setState((prevState) => ({
          ...prevState,
          loadProgress: 0
        }))
        alert('Received errors during load. Check log for details.')
        if (!nLoadItem) {
          showDropbox(app, true)
        }
      }
      if (nReceivedLoadAbort) {
        setState((prevState) => ({
          ...prevState,
          loadProgress: 0
        }))
        alert('Load was aborted.')
        showDropbox(app, true)
      }
    })

    app.addEventListener('loaditem', () => {
      if (nLoadItem !== null) nLoadItem += 1
    })

    app.addEventListener('loaderror', (event) => {
      console.error(event.error)
      if (nReceivedLoadError !== null) nReceivedLoadError += 1
    })

    app.addEventListener('loadabort', () => {
      if (nReceivedLoadAbort !== null) nReceivedLoadAbort += 1
    })

    app.addEventListener('keydown', (event) => {
      app.defaultOnKeydown(event)
    })

    window.addEventListener('resize', app.onResize)

    setState((prevState) => ({
      ...prevState,
      dwvApp: app
    }))

    setupDropbox(app)
    app.loadFromUri(window.location.href)
  }, [])

  const onChangeTool = (tool: string) => {
    if (state.dwvApp) {
      setState((prevState) => ({
        ...prevState,
        selectedTool: tool
      }))
      state.dwvApp.setTool(tool)
      if (tool === 'Draw') {
        onChangeShape(state.tools.Draw.options![0])
      }
    }
  }

  const canRunTool = (tool: string): boolean => {
    if (!state.dwvApp) return false
    if (tool === 'Scroll') {
      return state.dwvApp.canScroll()
    } else if (tool === 'WindowLevel') {
      return state.dwvApp.canWindowLevel()
    }
    return true
  }

  const toggleOrientation = () => {
    if (state.orientation) {
      if (state.orientation === 'axial') {
        setState((prevState) => ({
          ...prevState,
          orientation: 'coronal'
        }))
      } else if (state.orientation === 'coronal') {
        setState((prevState) => ({
          ...prevState,
          orientation: 'sagittal'
        }))
      } else if (state.orientation === 'sagittal') {
        setState((prevState) => ({
          ...prevState,
          orientation: 'axial'
        }))
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        orientation: 'coronal'
      }))
    }

    const config = {
      '*': [
        {
          divId: 'layerGroup0',
          orientation: state.orientation
        }
      ]
    }
    state.dwvApp!.setDataViewConfigs(config)
    const dataIds = state.dwvApp!.getDataIds()
    for (const dataId of dataIds) {
      state.dwvApp!.render(dataId)
    }
  }

  const onChangeShape = (shape: string) => {
    if (state.dwvApp) {
      state.dwvApp.setToolFeatures({ shapeName: shape })
    }
  }

  const onReset = () => {
    if (state.dwvApp) {
      state.dwvApp.resetDisplay()
    }
  }

  const handleTagsDialogOpen = () => {
    setState((prevState) => ({
      ...prevState,
      showDicomTags: true
    }))
  }

  const handleTagsDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      showDicomTags: false
    }))
  }

  const setupDropbox = (app: App) => {
    showDropbox(app, true)
  }

  const defaultHandleDragEvent = (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const onBoxDragOver = (event: DragEvent) => {
    defaultHandleDragEvent(event)
    const box = document.getElementById(state.dropboxDivId)
    if (box && box.className.indexOf(state.hoverClassName) === -1) {
      box.className += ' ' + state.hoverClassName
    }
  }

  const onBoxDragLeave = (event: DragEvent) => {
    defaultHandleDragEvent(event)
    const box = document.getElementById(state.dropboxDivId)
    if (box && box.className.indexOf(state.hoverClassName) !== -1) {
      box
      box.className = box.className.replace(' ' + state.hoverClassName, '')
    }
  }

  const onBoxDrop = (event: DragEvent) => {
    defaultHandleDragEvent(event)
    const box = document.getElementById(state.dropboxDivId)
    if (box) {
      box.className = state.dropboxClassName
    }

    const files = event.dataTransfer?.files
    if (files && state.dwvApp) {
      state.dwvApp.loadFiles(files)
    }
  }

  const showDropbox = (app: App, show: boolean) => {
    const box = document.getElementById(state.dropboxDivId)
    if (box) {
      box.style.display = show ? 'block' : 'none'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        id={state.dropboxDivId}
        className={`${state.dropboxClassName} border-dashed border-2 border-gray-400 p-4 flex flex-col items-center justify-center ${state.borderClassName}`}
        onDragOver={onBoxDragOver}
        onDragLeave={onBoxDragLeave}
        onDrop={onBoxDrop}
      >
        <Typography variant="h6" className="text-gray-700">
          Drag and drop DICOM files here to load
        </Typography>
        <Typography className="text-gray-600">or use the Open menu option.</Typography>
      </div>

      {state.loadProgress > 0 && (
        <LinearProgress variant="determinate" value={state.loadProgress} className="w-full mt-4" />
      )}

      <div id="layerGroup0" className="flex-grow mt-4 relative"></div>

      <div className="p-4">
        <ToggleButtonGroup
          value={state.selectedTool}
          exclusive
          onChange={(_, value) => onChangeTool(value)}
          className="flex flex-wrap justify-center mb-4"
        >
          {Object.keys(state.tools).map((tool) => (
            <ToggleButton
              key={tool}
              value={tool}
              disabled={!canRunTool(tool)}
              className={`m-2 ${state.selectedTool === tool ? 'bg-blue-500 text-white' : ''}`}
            >
              {tool}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <div className="flex justify-between">
          <IconButton onClick={onReset} className="m-2">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={toggleOrientation} className="m-2">
            <CameraswitchIcon />
          </IconButton>
          <IconButton onClick={handleTagsDialogOpen} className="m-2">
            <LibraryBooksIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default DwvComponent
