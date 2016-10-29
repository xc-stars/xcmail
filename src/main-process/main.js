const {app, BrowserWindow,ipcMain } = require('electron')
var MailReceiver = require('./mailReceiver');
let win = null
//用户列表
var users={};

function start () {
  win = new BrowserWindow({width: 800, height: 700})
  win.loadURL(`file://${__dirname}/../static/index.html`)
}

ipcMain.on('login',function(event,account){

	MailReceiver.login(account,function(err,user){
		event.sender.send('login',err,user)
		if(!err){
			users[1]=user;
		}
	})
	
})
ipcMain.on('getAllEmails',function(event,txt){
	receiver.getAllMails(function(txt){
		event.sender.send('getAllEmails',txt)
	})	
	
})

app.on('ready', start)


