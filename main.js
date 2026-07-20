const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Don't show until ready to prevent flashing
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Remove the standard window menu for a native app feel
  mainWindow.setMenuBarVisibility(false);

  // Boot the Express backend
  try {
    require('./backend/src/app.js');
    console.log("Backend started inside Electron.");
  } catch (err) {
    console.error("Failed to start backend:", err);
  }

  // Once Express starts on port 3000, load the local URL
  // We add a slight delay to ensure Express has fully bound to the port
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.show();
    mainWindow.maximize(); // Start maximized
  }, 1000);

  // Setup auto-updater listeners
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.log('Auto updater error on launch:', e);
  }

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version of DCMS is available. Downloading now...'
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      title: 'Install Update',
      message: 'A new update for DCMS has been downloaded. Restart the application to apply the updates.'
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
