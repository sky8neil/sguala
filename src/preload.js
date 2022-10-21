import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
    desktop: true,
});

contextBridge.exposeInMainWorld('config', {
    getAll: async () => await ipcRenderer.invoke('getAllConfig'),
    set: async (arg) => await ipcRenderer.invoke('putServerConfig', arg),
    del: async (uuid) => await ipcRenderer.invoke('delServerConfig', uuid),
    get: async(uuid) => await ipcRenderer.invoke('getServerConfig', uuid),

    getAlert: async (uuid) => await ipcRenderer.invoke('getAlertConfig', uuid),
    delAlert: async (uuid) => await ipcRenderer.invoke('delAlertConfig', uuid),
    pubAlert: async (arg) => await ipcRenderer.invoke('putAlertConfig', arg),

    exportClipboard: async () => await ipcRenderer.invoke('exportClipboard'),
    importClipboard: async () => await ipcRenderer.invoke('importClipboard'),
});

contextBridge.exposeInMainWorld('stat', {
    get: (uuid) => ipcRenderer.invoke('getStat', uuid),
    connect: (arg) => ipcRenderer.invoke('sshConnect', arg),
    close: (uuid) => ipcRenderer.invoke('sshClose', uuid),
});

contextBridge.exposeInMainWorld('ssh', {
    'startShell': async (uuid, shellCnt) => {}
});

contextBridge.exposeInMainWorld('ipc', {
    'send': (chan, data) => ipcRenderer.sendSync(chan, data),
    'on': (chan, fn) => ipcRenderer.on(chan, fn),
})

