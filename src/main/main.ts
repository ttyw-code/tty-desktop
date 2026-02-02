import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { icpMain } from '@/ipc-demo/demo.js';


class Main {

  start(): void {
    try {
      this.startup();

    } catch (error) {
      console.error('Application startup failed:', error);
      app.exit(1);
    }
  }

  private async startup(): Promise<void> {
    return;
  }
}


const createWindow = () => {
  // Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    // fullscreen: true,
    // frame: false,
    resizable: false,
    webPreferences: {
      preload: getPreloadPath()!,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile('out/renderer/index.html');
  }
};



app.whenReady().then(() => {
  
  init();
  registerIpcHandlers();
  app.on('activate', () => {
    if (!_isExistWindow()) {
      appMain.start();
      createWindow();
    }
  });
});

function registerIpcHandlers(): void {
  // Add IPC handlers here

  // 退出应用
  ipcMain.handle('app:quit', () => {
    app.quit();
  });

  ipcMain.handle('app:window:minimize', () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (focused) {
      focused.minimize();
    }
  });

  ipcMain.handle('app:window:close', () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (focused) {
      focused.close();
    }
  });
}


function _isExistWindow(): boolean {
  const allWindows = BrowserWindow.getAllWindows();
  return allWindows.length > 0;
}

function init(): void {

  createWindow();
  icpMain();
}


function getPreloadPath(): string | null {
  const appRoot = app.isPackaged ? app.getAppPath() : process.cwd();
  const preloadCandidates = [
    path.join(appRoot, 'out/src/main/preload.cjs'),
  ];
  const preloadPath = preloadCandidates.find((candidate) => fs.existsSync(candidate));
  if (!preloadPath) {
    console.warn('Preload file not found. Tried:', preloadCandidates);
  }
  return preloadPath || null;
}


// Entry point 
// Create Main instance and start the application
const appMain = new Main();
appMain.start();