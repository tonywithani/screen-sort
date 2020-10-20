class VizScreens {
    constructor() {
        this.dest = null;
        this.src = null;
    }

    set destination(arg) {
        this.dest = arg;
    }

    get destination() {
        return this.dest;
    }

    set source(arg) {
        this.src = arg;
    }

    get source() {
        return this.src;
    }

    // // Check if directory exists
    // ckdir() {
    //     return;
    // }

    // // Make directories.
    // mkdir() {
    //     return;
    // }

    // // Remove files.
    // rm() {
    //     return;
    // }

    // extract() {
    //     return;
    // }

    resest() {
        this.dest = null;
        this.src = null;
    }
}

module.exports = VizScreens