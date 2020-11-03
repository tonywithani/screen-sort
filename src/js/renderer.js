
'use strict';

/**
* @fileoverview buttons handlers for html
* @author Toni Zipevski - https://www.tonywithani.com
* @since 2020-11-03
* Website: https://www.tonywithani.com
*/

const { ipcRenderer } = require('electron');
var path = require('path');

class Header extends React.Component {
    render() {
        return (
            <div class="container">
                <div class="columns is-mobile">
                    <div class="column is-12">
                        <div class="control">
                            <h1 id="ProductName" class="title is-4">Screen Sort</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Source extends React.Component {
    onBrowse() {
        console.log("Browse Button Clicked")
        ipcRenderer.send('open-dialog')
    }

    render() {
        return (
            <div class="columns is-mobile">
                <div class="column is-9">
                    <div class="field">
                        <p class="control has-icons-left">
                            <input id="ZipFileLocation" class="input is-small" type="text" placeholder="Select Zip File" readOnly />
                            <span class="icon is-small is-left">
                                <i class="fas fa-file-archive"></i>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="column"><a id="SelectZip" class="button is-fullwidth is-warning is-small" onClick={this.onBrowse}>Browse</a>
                </div>
            </div>

        )
    }
}

class Destination extends React.Component {
    onSet() {
        console.log("Browse Button Clicked")
        ipcRenderer.send('open-dest-dialog')
    }

    onOpenFolder() {
        console.log("Show Folder Button Clicked");
        ipcRenderer.send('show-folder');
    }

    render() {
        return (
            <div class="columns is-mobile">
                <div class="column is-9">
                    <div class="field">
                        <p class="control has-icons-left">
                            <input id="UnZipFileLocation" class="input is-small" type="text" placeholder="Select Output Destination" readOnly onClick={this.onOpenFolder} />
                            <span class="icon is-small is-left">
                                <i class="fas fa-folder"></i>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="column">
                    <a id="SelectUnZip" class="button is-fullwidth is-warning is-small" onClick={this.onSet}>Set</a>
                </div>
            </div>
        )
    }
}

class Submit extends React.Component {
    onExtract() {
        console.log("Extract Button Clicked")
        ipcRenderer.send('extract-zip')
    }

    onReset() {
        console.log("Reset Button Clicked")
        ipcRenderer.send('reset-app')
    }

    render() {
        return (
            <div class="columns is-mobile">
                <div class="column is-9">
                    <a id="ExtractZip" class="button is-fullwidth is-success is-small" onClick={this.onExtract}>Extract</a>
                </div>
                <div class="column">
                    <button id="Reset" class="button is-danger is-outlined is-small is-fullwidth" onClick={this.onReset}>
                        <span>Reset</span>
                        <span class="icon is-small">
                            <i class="fas fa-times"></i>
                        </span>
                    </button>
                </div>
            </div>
        )
    }
}

class Footer extends React.Component {
    openLog() {
        ipcRenderer.send('open-log');
    }

    render() {
        return (
            <div class="columns is-mobile ml-5 mr-5 is-vcentered">
                <div class="column is-1">
                    <button id="OpenLog" class="button is-small is-text" onClick={this.openLog}>
                        <span class="icon is-small">
                            <i class="fas fa-file-alt"></i>
                        </span>
                        <span>Log</span>
                    </button>
                </div>
                <div class="column is-11 ml-5">
                    <p id="Messages" class="is-size-7"></p>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Header />, document.getElementById('ss-header'));
ReactDOM.render(<Source />, document.getElementById('ss-source'));
ReactDOM.render(<Destination />, document.getElementById('ss-destination'));
ReactDOM.render(<Submit />, document.getElementById('ss-submit'));
ReactDOM.render(<Footer />, document.getElementById('ss-footer'));

// Main Process Response Functions

ipcRenderer.on('file-selected', (event, arg) => {
    let filename = path.basename(arg)
    document.getElementById('ZipFileLocation').value = filename
    console.log(filename + " - " + arg)
});

ipcRenderer.on('file-extracted', (event, arg) => {
    document.getElementById('Messages').innerHTML = arg;
});

ipcRenderer.on('folder-selected', (event, arg) => {
    document.getElementById('UnZipFileLocation').value = arg
    console.log(filename + " - " + arg)
});

ipcRenderer.on('app-reset', (event) => {
    document.getElementById('ZipFileLocation').value = "";
    document.getElementById('UnZipFileLocation').value = "";
    document.getElementById('Messages').innerHTML = "Reset Complete.";
});

