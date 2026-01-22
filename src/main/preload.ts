import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('appBridge', {
  quit: () => ipcRenderer.invoke('app:quit'),
});
