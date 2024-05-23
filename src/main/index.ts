/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    //set the default size to fit to screen
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
    icon: join(__dirname, '../renderer/assets/logo.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.setIcon(join(__dirname, '../renderer/assets/logo.png'))

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Set dock icon (only for macOS)
  if (process.platform === 'darwin') {
    app.dock.setIcon(resolve(__dirname, '../assets/logo.png'))
  }

  //disable reload shortcuts both development and production mode
  if (is.dev || !is.dev) {
    app.on('browser-window-focus', function () {
      // Disable reload shortcuts
      globalShortcut.register('CommandOrControl+R', () => {
        console.log('CommandOrControl+R is pressed: Shortcut Disabled')
      })
      globalShortcut.register('F5', () => {
        console.log('F5 is pressed: Shortcut Disabled')
      })
      // Disable inspect element shortcuts
      globalShortcut.register('CommandOrControl+Shift+I', () => {
        console.log('CommandOrControl+Shift+I is pressed: Shortcut Disabled')
      })
      globalShortcut.register('I', () => {
        console.log('I is pressed: Shortcut Disabled')
      })
    })

    app.on('browser-window-blur', function () {
      // Enable reload shortcuts when the window loses focus
      globalShortcut.unregister('CommandOrControl+R')
      globalShortcut.unregister('F5')

      // Enable inspect element shortcuts when the window loses focus
      globalShortcut.unregister('CommandOrControl+Shift+I')
      globalShortcut.unregister('I')
    })
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
