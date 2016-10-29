var fs=require('fs')
function MailCache (option) {
	this.path=option.path
}
MailCache.prototype.set = function (key, value) {

}
//从目标地址中获取
MailCache.prototype.get = function (key) {
	if(key==='1')return '12';
	return undefined;
}

module.exports = MailCache
