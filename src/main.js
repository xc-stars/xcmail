const {app, BrowserWindow} = require('electron')

let win = null

function start () {
  win = new BrowserWindow({width: 800, height: 700})
  win.loadURL(`file://${__dirname}/../static/index.html`)

}

app.on('ready', start)
