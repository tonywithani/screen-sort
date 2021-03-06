'use strict';
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { electron } = require('process');
const openExplorer = require('open-file-explorer');
const sortScreens = require('./js/sortscreens');
const log = require('electron-log');

log.info("Launching " + app.getName() + " v" + app.getVersion());

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 640,
    height: 360,
    resizable: false,
    autoHideMenuBar: true,
    titleBarStyle: "default",
    icon: "img/favicon.ico",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Set Window Title
  mainWindow.setTitle(app.getName() + " v" + app.getVersion());

  // Hide Menu
  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ///////////////////////////////////////////////////////////////////
  // MY CODE BEGINS
  ///////////////////////////////////////////////////////////////////

  ipcMain.on('open-dialog', (event) => {
    log.info('Selecting Source ...');
    screens.source = dialog.showOpenDialogSync(mainWindow, { title: "Select Zip file", filters: [{ name: 'Archives', extensions: ['zip'] }], properties: ['openFile'] });
    log.info('Source: ' + screens.source);
    event.sender.send('file-selected', screens.source);
    event.sender.send('file-extracted', screens.source);
  });

  ipcMain.on('extract-zip', (event) => {
    console.time('Extract-Time');
    log.info('Extracting: ' + screens.source);
    if (screens.source == null || screens.source == undefined || screens.destination == null || screens.destination == undefined) {
      return log.info("Can't extraxt Zip. No Zip file or no destination folder selected.");
    }
    screens.extract();
    screens.makeDirectories();
    screens.sort();
    event.sender.send('file-extracted', "File extracted.");
    // event.sender.send('file-extracted');
    console.timeEnd('Extract-Time');
  });

  ipcMain.on('open-dest-dialog', (event) => {
    log.info("Selecting destination ...");
    screens.destination = dialog.showOpenDialogSync(mainWindow, { title: "Select destination folder", properties: ['openDirectory'] });
    log.info(screens.destination);
    event.sender.send('folder-selected', screens.destination);
    event.sender.send('file-extracted', screens.destination);

  });

  ipcMain.on('show-folder', (event) => {
    if (screens.destination != null) {
      log.info("Opening Folder: " + screens.destination);
    } else {
      log.info("Opening Folder: This PC");
    }

    openExplorer(screens.destination, err => {
      if (err) throw log.info(err);
    });
    event.sender.send('file-extracted', "Destination folder opened.");
  });

  ipcMain.on('reset-app', (event) => {
    screens.resest();
    log.info("Reset Complete.");
    event.sender.send('app-reset');
  });

  ipcMain.on('open-log', (event) => {
    openExplorer(path.join(app.getPath('userData'), 'logs'), err => {
      if (err) throw log.info(err);
    });
    log.info("Log folder opened.");
    event.sender.send('file-extracted', "Log folder opened.");
  });

  ///////////////////////////////////////////////////////////////////
  // MY CODE ENDS
  ///////////////////////////////////////////////////////////////////

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Initialise SortScreens Class
let screens = new sortScreens()
