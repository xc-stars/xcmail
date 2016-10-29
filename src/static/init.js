// 每个页面的初始化脚本
var usersList = []

init()
function init () {
  initUserList()
}
// 获取当前已经登录的用户列表
function initUserList () {
  const ipcRenderer = require('electron').ipcRenderer
  ipcRenderer.send('getUserList')
  ipcRenderer.once('getUserList', function (event, list) {
    emptyUsersList()
    console.log(list)
    var key
    for (key in list) {
      usersList[key] = list[key]
    }
  })
// 清空usersList对象
  function emptyUsersList () {
    var key
    for (key in usersList) {
      delete usersList[key]
    }
  }
}
