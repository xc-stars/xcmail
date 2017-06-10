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
/**
 * 获取所有的邮件，传入一个box的名称和一个用户名
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
ipcMain.on('getAllMails', (event, config) => {
  var username =config.username;
  var boxname=config.boxname;
  receivers[utils.md5(username)].getMailsHeaderPage(config,function(res){
   event.sender.send('getAllMails', res)
  })
})
/**
 * 获取所有的邮件，传入一个box的名称和一个用户名
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
ipcMain.on('getAllMails', (event, config) => {
  var username =config.username;
  var boxname=config.boxname;
  receivers[utils.md5(username)].getMailsHeaderPage(config,function(res){
   event.sender.send('getAllMails', res)
  })
})
/**
 * 根据邮件的uid获取一个邮件
 * @param  {[type]}
 * @return {[type]}
 */
ipcMain.on('getMail', (event, config) => {
  var username =config.username;
  var uid=config.uid;
  //是否变成已读
  var markSeen=false;
  console.log(config)
  receivers[utils.md5(username)].getMail(uid,markSeen,function(res){
   event.sender.send('getMail', res)
  })
})



/**
 * 获取所有的文件夹
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
ipcMain.on('getAllBoxs', (event, username) => {
  receivers[utils.md5(username)].getAllBoxes((boxs) => {
    event.sender.send('getAllBoxs', boxs)
  })
})


app.on('ready', start)

