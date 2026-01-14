import { app, BrowserWindow, screen } from 'electron';
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
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // win.loadFile('src/renderer/index.html');
  win.loadURL('https://www.google.com');
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