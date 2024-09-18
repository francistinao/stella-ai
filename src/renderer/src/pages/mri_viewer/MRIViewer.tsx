/* eslint-disable prettier/prettier */
/**
 * import React, { useState, useEffect } from 'react'
import { App, getDwvVersion } from 'dwv'
import {
  Typography,
  LinearProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import '@/assets/DwvComponent.css'

const MRIViewer: React.FC = () => {
  const [dwvApp, setDwvApp] = useState<App | null>(null)
  const [selectedTool, setSelectedTool] = useState('Select Tool')
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    const app = new App()
    app.init({
      dataViewConfigs: { '*': [{ divId: 'layerGroup0' }] },
      tools: {
        Scroll: {},
        ZoomAndPan: {},
        WindowLevel: {},
        Draw: { options: ['Ruler'] },
      }
    })

    app.addEventListener('loadprogress', (event: any) => {
      setLoadProgress(event.loaded)
    })

    app.addEventListener('loadend', () => {
      setLoadProgress(0)
    })

    setDwvApp(app)

    return () => {
      if (app) {
        app.reset()
      }
    }
  }, [])

  const onChangeTool = (tool: string) => {
    if (dwvApp) {
      setSelectedTool(tool)
      dwvApp.setTool(tool)
    }
  }

  const onReset = () => {
    if (dwvApp) {
      dwvApp.resetDisplay()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && dwvApp) {
      dwvApp.loadFiles(files)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <input type="file" onChange={handleFileChange} accept=".dcm" multiple />
      </div>

      {loadProgress > 0 && (
        <LinearProgress variant="determinate" value={loadProgress} className="w-full mt-4" />
      )}

      <div id="layerGroup0" className="flex-grow mt-4 relative"></div>

      <div className="p-4">
        <ToggleButtonGroup
          value={selectedTool}
          exclusive
          onChange={(_, value) => onChangeTool(value)}
          className="flex flex-wrap justify-center mb-4"
        >
          {['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'].map((tool) => (
            <ToggleButton
              key={tool}
              value={tool}
              className={`m-2 ${selectedTool === tool ? 'bg-blue-500 text-white' : ''}`}
            >
              {tool}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <div className="flex justify-between">
          <IconButton onClick={onReset} className="m-2">
            <RefreshIcon />
          </IconButton>
          <IconButton className="m-2">
            <CameraswitchIcon />
          </IconButton>
          <IconButton className="m-2">
            <LibraryBooksIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default MRIViewer
 * 
 */
