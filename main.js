const { app, BrowserWindow, dialog, ipcMain } = require('electron');
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
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
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

  // --- Auto-Updater Event Handlers ---
  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus('checking', 'Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    sendUpdateStatus('available', `Update v${info.version} is available. Downloading...`);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version of Radiance Derms is available. Downloading now...'
    });
  });

  autoUpdater.on('update-not-available', () => {
    sendUpdateStatus('up-to-date', 'You are running the latest version.');
  });

  autoUpdater.on('download-progress', (progress) => {
    const percent = Math.round(progress.percent || 0);
    const speed = ((progress.bytesPerSecond || 0) / (1024 * 1024)).toFixed(1);
    sendUpdateStatus('downloading', `Downloading update: ${percent}% (${speed} MB/s)`, { percent });
  });

  autoUpdater.on('update-downloaded', () => {
    sendUpdateStatus('ready', 'Update downloaded! Click below to restart and install.', { percent: 100 });
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      title: 'Install Update',
      message: 'A new update for Radiance Derms has been downloaded. Restart the application to apply the updates.'
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    const errMsg = err ? (err.message || String(err)) : '';
    if (errMsg.includes('404') || errMsg.includes('Cannot find latest.yml') || errMsg.includes('latest.yml')) {
      sendUpdateStatus('up-to-date', 'You are running the latest version. (No newer release published on GitHub)');
    } else {
      sendUpdateStatus('error', 'Unable to reach update server. Check your connection or GitHub repository.');
    }
    console.log('Auto updater error:', err);
  });
}

// Send update status to the renderer process
function sendUpdateStatus(status, message, details = {}) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('update-status', { status, message, ...details });
  }
}

// --- IPC Handlers ---
ipcMain.on('check-for-updates', () => {
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    sendUpdateStatus('error', 'Could not check for updates.');
  }
});

ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
