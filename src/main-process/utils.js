var crypto = require('crypto')
var path=require('path')
exports.md5 = function (str) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}
//获取项目地址
exports.getRootPath=function(){
		return __dirname.substring(0,__dirname.indexOf('xcmail')+'xcmail'.length)
}
exports.p=function(){
		console.log('----------------------------------')
}

// console.log(exports.getRootPath())