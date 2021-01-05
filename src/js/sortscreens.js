'use strict';

/**
* @name screensort 
* @fileoverview sortscreen is library to sort TAB Ads according to size.
*
* Files arre sorted in 4 folders: ff, mini, misc and sqz.
*
* @author Toni Zipevski - https://www.tonywithani.com
* @since 2020-11-03
* Website: https://www.tonywithani.com
*/

const fs = require('fs');
const path = require('path');
var AdmZip = require('adm-zip');
const log = require('electron-log');

class SortScreens {
  constructor() {
    log.info('Initialise ... sortscreen.js');
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
    console.time('Extract');
    this.zip_length = this.zip.getEntries()
    this.zip.extractAllTo(this.dest, true);
    console.timeEnd('Extract');
  }

  sort() {
    console.time('Sort');
    log.info('Sorting ...')
    let files = fs.readdirSync(this.dest);
    let i = 0;
    files.forEach((file) => {
      let current_path = path.join(this.dest, file);
      let new_path;
      let stats = fs.statSync(current_path);

      if (!stats.isDirectory()) {
        if (file.includes("1920x1080") || file.includes("FF")) {
          new_path = path.join(this.dest, "ff", file);
          fs.renameSync(current_path, new_path);
        } else if (file.includes("1740x1074") || file.includes("SQZ")) {
          new_path = path.join(this.dest, "sqz", file);
          fs.renameSync(current_path, new_path);
        } else if (file.includes("1214x478") || file.includes("MVB")) {
          new_path = path.join(this.dest, "mini", file);
          fs.renameSync(current_path, new_path);
        } else {
          new_path = path.join(this.dest, "misc", file);
          fs.renameSync(current_path, new_path);
        }
        log.info('Moved: ' + file);
      } else {
        log.info("Skipped: " + file);
      }
    });
    console.timeEnd('Sort');
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
      log.info("Dir Created: " + dir);
    } else {
      log.info("Dir Exists: " + dir);
    }
  }

  makeDirectories() {
    console.time('Make-Directories');
    this.makeDirectory("ff");
    this.makeDirectory("mini");
    this.makeDirectory("misc");
    this.makeDirectory("sqz");
    console.timeEnd('Make-Directories');
  }
}

module.exports = SortScreens
