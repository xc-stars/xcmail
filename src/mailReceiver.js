var Imap = require('imap');
//初始化imap
function MailReceiver(account) {
	this.username = account.username;
	this.password = account.password;
	this.port = account.port||993
	this.ssl = account.ssl||true;
	this.host = account.host||"imap.qq.com";

	this._imap = new Imap({
	  user: this.username,
	  password: this.password,
	  host: this.host,
	  port: this.port,
	  tls: this.ssl
	});

	this._imap.once('error', function (err) {
	  console.log(err)
	})

	this._imap.once('end', function () {
	  console.log('Connection ended')
	})

}
//获取所有的miall
MailReceiver.prototype.getAllMails=function(){
	this._imap.once('ready', function () {
		console.log("连接成功")
		//TODO:Get mails
	})
	this._imap.connect()
}
//search
MailReceiver.prototype.search=function(search){
	this._imap.once('ready', function () {
		console.log("连接成功")
		//TODO:search
	})
	this._imap.connect()
	
}


module.exports = MailReceiver;
