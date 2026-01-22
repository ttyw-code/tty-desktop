import { app, BrowserWindow, screen, Menu } from 'electron';
import { icpMain } from '@/ipc-demo/demo.js';
import { longestCommonSubsequence } from '@/common/linkedList.js';


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
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    // fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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
  app.on('activate', () => {
    if (!_isExistWindow()) {
      appMain.start();
      createWindow();
    }
  });
});


function _isExistWindow(): boolean {
  const allWindows = BrowserWindow.getAllWindows();
  return allWindows.length > 0;
}

function init(): void {

  const lcs = longestCommonSubsequence(['a', 'b', 'c','d'], ['a', 'c', 'd']);
  console.log('Longest Common Subsequence:', lcs);
  createWindow();
  icpMain();
}


// Entry point 
// Create Main instance and start the application
const appMain = new Main();
appMain.start();