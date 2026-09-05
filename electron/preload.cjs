const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('enosxDesktop', {
  isDesktop: true,
  version: process.versions.electron,
})
