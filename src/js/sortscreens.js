///////////////////////////////////////////////////////////////////
// MY CODE BEGINS
///////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const extractzip = require('extract-zip');
var AdmZip = require('adm-zip');

class SortScreens {
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
    this.zip = null;
    this.zip_length = null;
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

module.exports = SortScreens

///////////////////////////////////////////////////////////////////
// MY CODE ENDS
///////////////////////////////////////////////////////////////////