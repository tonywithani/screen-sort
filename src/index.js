const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { electron } = require('process');


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

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ///////////////////////////////////////////////////////////////////
  // MY CODE BEGINS
  ///////////////////////////////////////////////////////////////////

  ipcMain.on('open-dialog', (event) => {
    console.log("Selecting source ...");
    screens.source = dialog.showOpenDialogSync(mainWindow, { title: "Select Zip file", properties: ['openFile'] });
    event.sender.send('file-selected', screens.source);
  });

  ipcMain.on('extract-zip', (event) => {
    console.log("Extracting: " + screens.source);
    screens.AdmExtract();
    screens.makeDirectories();
    screens.sort();
    // event.sender.send('file-extracted');
    // screens.resest();
  });

  ipcMain.on('open-dest-dialog', (event) => {
    console.log("Selecting destination ...");
    screens.destination = dialog.showOpenDialogSync(mainWindow, { title: "Select destination folder", properties: ['openDirectory'] });
    event.sender.send('folder-selected', screens.destination);
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
  }

  set destination(arg) {
    this.dest = arg[0];
  }

  get destination() {
    return this.dest;
  }

  set source(arg) {
    this.src = arg[0];
  }

  get source() {
    return this.src;
  }

  extract() {
    try {
      extractzip(this.src, { dir: this.dest })
      console.log('Extraction complete')
    } catch (err) {
      console.log("An error occured extracting Zip")
    }
  }

  // Works but doesn't calculate the length of the array
  async extract2() {
    try {
      await extractzip(this.src, { dir: this.dest })
      console.log('Extraction complete')
    } catch (err) {
      console.log("An error occured extracting Zip")
    } finally {
      this.sort()
    }
  }

  AdmExtract() {
  let zip = new AdmZip(this.src);
  zip.extractAllTo(this.dest, true);
}

// sort() {
//   console.log("Sorting ...")

//   //passsing directoryPath and callback function
//   fs.readdir(this.dest, function (err, files) {
//     //handling error
//     if (err) {
//       return console.log('Unable to scan directory: ' + err);
//     }
//     //listing all files using forEach
//     files.forEach(function (file) {
//       // Do whatever you want to do with the file
//       console.log(file);
//     });
//   });
// }

// sort() {
//   console.log("Sorting...");
//   fs.readdir(this.dest, (err, files) => {
//     if (err) {
//       return console.log('Unable to scan directory: ' + err);
//     }
//     files.forEach((file) => {
//       console.log(file);
//     });
//   })
// }


sort() {
  console.log("Sorting...");
  fs.readdir(this.dest, (err, files) => {
    if (err) throw err;

    // let file;
    // for (file of files) {
    //   console.log(file);
    // }

    files.forEach( file => console.log(file)); // Does read files just created.
  })
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