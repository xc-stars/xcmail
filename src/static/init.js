// 每个页面的初始化脚本
var usersList = []
window.onload=function(){
  init()  
  
}
/**
 * 初始化
 * @return {[type]}
 */
function init () {
  initUserList()
  initListener()
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
/**
 * 初始化监听器
 * @return {[type]}
 */
function initListener(){
  const ipcRenderer = require('electron').ipcRenderer
  //测试获取所有的文件夹
  var getAllBoxsDom=document.querySelector("#getAllBoxs");
  getAllBoxsDom.onclick=function(e){
    console.log('click getAllBoxsDom')
    ipcRenderer.send('getAllBoxs',e.currentTarget.dataset.username)
    ipcRenderer.once('getAllBoxs', function (event, boxs) {
      console.log(boxs)        
    })
  } 
  //测试获取所有的收信箱文件的邮件
  var getAllMailsByInBoxsDom=document.querySelector("#getAllMailsByInBoxs");
  getAllMailsByInBoxsDom.onclick=function(e){
    console.log('click getAllMailsByInBoxsDom')
    ipcRenderer.send('getAllMails',{boxname:"INBOX",username:e.currentTarget.dataset.username,start:1,end:40})
    ipcRenderer.once('getAllMails', function (event, res) {
      console.log(JSON.stringify(res))        
    })
  } 
}




 
