import { app, BrowserWindow } from 'electron';
import { icpMain } from '@/ipc-demo/demo.js';


class Main {

  main(): void {
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
    titleBarStyle: 'hidden',
    // ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  });

  win.loadFile('src/renderer/index.html');
};

app.whenReady().then(() => {
  init();
  app.on('activate', () => {
    if (!_isExistWindow()) {
      createWindow();
    }
  });
});


function _isExistWindow(): boolean {
  const allWindows = BrowserWindow.getAllWindows();
  return allWindows.length > 0;
}

function init(): void {
  createWindow();
  icpMain();
}


// Entry point 
// Create Main instance and start the application
const appMain = new Main();
appMain.main();