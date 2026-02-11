import { contextBridge, ipcRenderer,webUtils } from 'electron';

contextBridge.exposeInMainWorld('appBridge', {
  quit: () => ipcRenderer.invoke('app:quit'),
  minimize: () => ipcRenderer.invoke('app:window:minimize'),
  close: () => ipcRenderer.invoke('app:window:close'),
});

contextBridge.exposeInMainWorld('webUtils', {
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
});
