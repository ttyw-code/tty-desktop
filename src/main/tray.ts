import { app, Menu, Tray, nativeImage } from 'electron';
import path from 'path';

function getTrayIconPath(): string {
  const iconFile = process.platform === 'darwin' ? 'brain.icns' : 'brain.ico';
  const appRoot = app.isPackaged ? process.resourcesPath : process.cwd();
  return path.join(appRoot, 'build', 'icons', iconFile);
}

export function createTray(onDoubleClick: () => void): Tray {
  const iconPath = getTrayIconPath();
  const trayImage = nativeImage.createFromPath(iconPath);
  if (trayImage.isEmpty()) {
    console.warn('Tray icon not found or could not be loaded:', iconPath);
  }

  const tray = new Tray(trayImage);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出应用',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('tty-kumo');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', onDoubleClick);
  return tray;
}
