const {app, BrowserWindow,ipcMain } = require('electron')

let win = null

function start () {
  win = new BrowserWindow({width: 800, height: 700})
  win.loadURL(`file://${__dirname}/../static/index.html`)
}

ipcMain.on('test',function(event,txt){
	console.log('this is txt: '+txt)
})

app.on('ready', start)


