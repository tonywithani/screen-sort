const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { electron } = require('process');
const openExplorer = require('open-file-explorer');



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
  mainWindow.setTitle(process.env.npm_package_productName + " v" + process.env.npm_package_version + " (Build " + process.env.npm_package_config_tz_build + ")");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ///////////////////////////////////////////////////////////////////
  // MY CODE BEGINS
  ///////////////////////////////////////////////////////////////////

  ipcMain.on('open-dialog', (event) => {
    console.log("Selecting source ...");
    screens.source = dialog.showOpenDialogSync(mainWindow, { title: "Select Zip file", properties: ['openFile'] });
    console.log(screens.source);
    event.sender.send('file-selected', screens.source);
    event.sender.send('file-extracted', screens.source);
  });

  ipcMain.on('extract-zip', (event) => {
    console.log("Extracting: " + screens.source);
    if (screens.source == null || screens.source == undefined || screens.destination == null || screens.destination == undefined) {
      return console.log("ERROR: Can't extraxt Zip. No Zip file or no destination folder selected.");
    }
    screens.extract();
    screens.makeDirectories();
    screens.sort();
    event.sender.send('file-extracted', "File extracted.");
    // event.sender.send('file-extracted');
    // screens.resest();
  });

  ipcMain.on('open-dest-dialog', (event) => {
    console.log("Selecting destination ...");
    screens.destination = dialog.showOpenDialogSync(mainWindow, { title: "Select destination folder", properties: ['openDirectory'] });
    console.log(screens.destination);
    event.sender.send('folder-selected', screens.destination);
    event.sender.send('file-extracted', screens.destination);

  });


  ipcMain.on('show-folder', (event) => {
    if (screens.destination != null) {
      console.log("Opening Folder: " + screens.destination);
    } else {
      console.log("Opening Folder: This PC");
    }

    openExplorer(screens.destination, err => {
      if (err) throw console.log(err);
    });
    event.sender.send('file-extracted', "Destination folder opened.");
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

///////////////////////////////////////////////////////////////////
// MY CODE BEGINS
///////////////////////////////////////////////////////////////////

const fs = require('fs');
const extractzip = require('extract-zip');
var AdmZip = require('adm-zip');

class VizScreens {
  constructor() {
    this.dest = null;
    this.src = null;
    this.zip = null;
    this.zip_length = null;
  }

  set destination(arg) {
    if (arg !== undefined) {
      this.dest = arg[0];
    } else {
      this.dest = arg;
    }
  }

  get destination() {
    return this.dest;
  }

  set source(arg) {
    if (arg !== undefined) {
      this.src = arg[0];
      this.zip = new AdmZip(this.src);
    } else {
      this.src = arg;
    }
  }

  get source() {
    return this.src;
  }


  extract() {
    // let zip = new AdmZip(this.src);    
    this.zip_length = this.zip.getEntries()
    this.zip.extractAllTo(this.dest, true);
  }

  sort() {
    console.log("Sorting...");
    let files = fs.readdirSync(this.dest);
    let i = 0;
    files.forEach((file) => {
      let current_path = path.join(this.dest, file);
      let new_path;
      let stats = fs.statSync(current_path);

      if (!stats.isDirectory()) {
        if (file.includes("1920x1080")) {
          new_path = path.join(this.dest, "ff", file);
          fs.renameSync(current_path, new_path);
          console.log("MOVED: " + file)
        } else if (file.includes("1740x1074")) {
          new_path = path.join(this.dest, "sqz", file);
          fs.renameSync(current_path, new_path);
          console.log("MOVED: " + file)
        } else if (file.includes("1214x478")) {
          new_path = path.join(this.dest, "mini", file);
          fs.renameSync(current_path, new_path);
          console.log("MOVED: " + file)
        } else {
          new_path = path.join(this.dest, "misc", file);
          fs.renameSync(current_path, new_path);
          console.log("MOVED: " + file)
        }
      } else {
        console.log("SKIPPED: " + file)
      }
    });
  }

  resest() {
    this.dest = null;
    this.src = null;
  }

  makeDirectory(arg) {
    let dir = path.join(this.dest, arg);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Dir Created: " + dir);
    } else {
      console.log("Dir Exists: " + dir);
    }
  }

  makeDirectories() {
    this.makeDirectory("ff");
    this.makeDirectory("mini");
    this.makeDirectory("misc");
    this.makeDirectory("sqz");
  }
}

let screens = new VizScreens()

///////////////////////////////////////////////////////////////////
// MY CODE ENDS
///////////////////////////////////////////////////////////////////