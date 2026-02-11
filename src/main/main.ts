import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { icpMain } from '@/ipc-demo/demo.js';
import { EventEmitter } from 'events';
import dns from 'dns';
import { getLevelDbWorker, type LevelDbWorkerClient } from './db-worker/level-db-worker';




let levelDbWorker: LevelDbWorkerClient | null = null;

dns.lookup('www.baidu.com', (err, address, family) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  }
  else {
    console.log(`Address: ${address}, Family: IPv${family}`);
  }
});
class MyEmitter extends EventEmitter {

  constructor() {
    super();
  }

  private _counter = 0;

  increment() {
    this._counter++;
    this.emit('incremented', this._counter);
  }

  get counter() {
    return this._counter;
  }
}


const myEmitter = new MyEmitter();

setInterval(() => { myEmitter.increment(); }, 5000);


console.log(myEmitter.getMaxListeners()); // 获取当前事件的最大监听器数量
console.log(myEmitter.eventNames()); // 获取当前注册的事件名称列表

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
  levelDbWorker = getLevelDbWorker();
  const dbPath = path.join(app.getPath('userData'), 'mydb');
  fs.mkdirSync(dbPath, { recursive: true });
  levelDbWorker?.init(dbPath).then(() => {
    console.log('LevelDB worker initialized');
  }).catch((error) => {
    console.error('Failed to initialize LevelDB worker:', error);
  });
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