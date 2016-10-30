var fs=require('fs')
var path=require('path')
function MailCache (option) {
	this.path=option.path

	if(!fs.existsSync(this.path)){
		fs.mkdirSync(this.path);
	}
}
MailCache.prototype.set = function (key, value) {
	console.log('writeing  file ')
	fs.writeFileSync(path.join(this.path,key),value,'utf-8');
}
//从目标地址中获取
MailCache.prototype.get = function (key) {
	if(fs.existsSync(path.join(this.path,key)))
		return fs.readFileSync(key,'utf-8')
	else return undefined;
}

module.exports = MailCache
