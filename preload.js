// preload.js (düzeltilmiş)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // --- sizin mevcut metodlarınız ---
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),
  startDownload: (payload) => ipcRenderer.invoke('start-download', payload),
  cancelDownload: (id) => ipcRenderer.invoke('cancel-download', id),
  onProgress: (cb) => ipcRenderer.on('download-progress', (_e, data) => cb(data)),
  onLog: (cb) => ipcRenderer.on('download-log', (_e, data) => cb(data)),
  onDone: (cb) => ipcRenderer.on('download-done', (_e, data) => cb(data)),
  onMenuStart: (cb) => ipcRenderer.on('menu-start-download', () => cb()),
  onMenuCancel: (cb) => ipcRenderer.on('menu-cancel-download', () => cb()),

  // --- burayı ekleyin: yerel sürüm ve ad ---
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName:    () => ipcRenderer.invoke('get-app-name'),
});

// (opsiyonel) Alias
contextBridge.exposeInMainWorld('appInfo', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getName:    () => ipcRenderer.invoke('get-app-name'),
});
