/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { spawn } from 'child_process'

const basePath = is.dev
  ? 'D:/stella_ai_frontend/src/renderer/src/assets'
  : join(__dirname, 'renderer')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    focusable: true,
    width: 2680,
    height: 2100,
    show: false,
    autoHideMenuBar: true,
    resizable: true,
    maxWidth: 2680,
    maxHeight: 2100,
    minWidth: 1400,
    minHeight: 800,
    fullscreenable: true,
    icon: join(basePath, 'logo.png'),
    webPreferences: {
      preload: join(__dirname, 'preload/index.js'),
      sandbox: false
    }
  })

  const backendProcess = spawn('uvicorn', ['main:app', '--reload'], {
    cwd: 'D:/stella-ai_api_v2',
    shell: true
  })

  // Handle backend process events
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend stdout: ${data}`)
  })

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`)
  })

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.setIcon(join(basePath, 'logo.png'))

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(
      is.dev
        ? 'D:/stella_ai_frontend/src/renderer/index.html'
        : join(__dirname, 'renderer/index.html')
    )
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (process.platform === 'darwin') {
    app.dock.setIcon(join(basePath, 'logo.png'))
  }

  if (is.dev || !is.dev) {
    app.on('browser-window-focus', function () {
      globalShortcut.register('CommandOrControl+R', () => {
        console.log('CommandOrControl+R is pressed: Shortcut Disabled')
      })
      globalShortcut.register('F5', () => {
        console.log('F5 is pressed: Shortcut Disabled')
      })
      globalShortcut.register('CommandOrControl+Shift+I', () => {
        console.log('CommandOrControl+Shift+I is pressed: Shortcut Disabled')
      })
      globalShortcut.register('I', () => {
        console.log('I is pressed: Shortcut Disabled')
      })
    })

    app.on('browser-window-blur', function () {
      globalShortcut.unregister('CommandOrControl+R')
      globalShortcut.unregister('F5')
      globalShortcut.unregister('CommandOrControl+Shift+I')
      globalShortcut.unregister('I')
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
