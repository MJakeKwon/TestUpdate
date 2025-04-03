const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // 개발 중일 때1
  // win.loadURL('http://localhost:8080');

  // 배포용
  win.loadFile(path.join(__dirname, 'dist/index.html'));

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);