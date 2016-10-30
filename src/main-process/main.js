const {app, BrowserWindow, ipcMain } = require('electron')
var MailReceiver = require('./mailReceiver')
var utils = require('./utils')
let win = null
// 用户(邮件接收器)列表
var receivers = {}

function start () {
  win = new BrowserWindow({width: 800, height: 700})
  win.loadURL(`file://${__dirname}/../static/index.html`)
}
// 获取现在已经成功登录的用户
// 只需要返回用户名
ipcMain.on('getUserList', (event, account) => {
  var key
  var usersTemp = []
  for (key in receivers) {
    usersTemp.push(receivers[key].username)
  }
  event.sender.send('getUserList', usersTemp)
})

// 登录接口
ipcMain.on('login', (event, account) => {
  MailReceiver.login(account, (err, receiver) => {
    event.sender.send('login', err)
    if (!err) {
      console.log(receiver.username)
      console.log(utils.md5(receiver.username))
      receivers[utils.md5(receiver.username)] = receiver
    }
  })
})
ipcMain.on('getAllEmails', (event, username) => {
  receivers[utils.md5(username)].getAllMails((txt) => {
    event.sender.send('getAllEmails', txt)
  })
})

ipcMain.on('testMail', (event) => {
  MailReceiver.login({username:'lovecodeq@foxmail.com',password:'jtnoxtpestzcbheb',host:'imap.qq.com',port:993,ssl:true},function(err,receiver){
  // console.log(err,receiver)
    receiver.getMail('85',false,function(txt){
       event.sender.send('testMail', txt)
    })
  })

  
})

app.on('ready', start)

