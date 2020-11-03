
'use strict';

/**
* @fileoverview buttons handlers for html
* @author Toni Zipevski - https://www.tonywithani.com
* @since 2020-11-03
* Website: https://www.tonywithani.com
*/

const { ipcRenderer } = require('electron')
var path = require('path');

const BrowseZipBtn = document.getElementById('SelectZip');
const ExtractZipBtn = document.getElementById('ExtractZip');
const BrowseUnZipBtn = document.getElementById('SelectUnZip');
const ShowFolderBtn = document.getElementById('UnZipFileLocation');
const ResetBtn = document.getElementById('Reset');
const LogBtn = document.getElementById('OpenLog');

BrowseZipBtn.addEventListener('click', function () {
    console.log("Browse Button Clicked")
    ipcRenderer.send('open-dialog')
});

ipcRenderer.on('file-selected', (event, arg) => {
    let filename = path.basename(arg)
    document.getElementById('ZipFileLocation').value = filename
    console.log(filename + " - " + arg)
});

ExtractZipBtn.addEventListener('click', () => {
    console.log("Extract Button Clicked")
    ipcRenderer.send('extract-zip')
});

ipcRenderer.on('file-extracted', (event, arg) => {
    document.getElementById('Messages').innerHTML = arg;
});

BrowseUnZipBtn.addEventListener('click', () => {
    console.log("Browse Button Clicked")
    ipcRenderer.send('open-dest-dialog')
});

ipcRenderer.on('folder-selected', (event, arg) => {
    document.getElementById('UnZipFileLocation').value = arg
    console.log(filename + " - " + arg)
});

ShowFolderBtn.addEventListener('click', () => {
    console.log("Show Folder Button Clicked")
    ipcRenderer.send('show-folder')
});

ResetBtn.addEventListener('click', function () {
    console.log("Reset Button Clicked")
    ipcRenderer.send('reset-app')
});

ipcRenderer.on('app-reset', (event) => {
    document.getElementById('ZipFileLocation').value = "";
    document.getElementById('UnZipFileLocation').value = "";
    document.getElementById('Messages').innerHTML = "Reset Complete.";
});

LogBtn.addEventListener('click', function () {
    console.log("Log Button Clicked")
    ipcRenderer.send('open-log')
});

