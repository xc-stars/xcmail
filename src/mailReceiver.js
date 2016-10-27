var Imap = require('imap');
//初始化imap
function MailReceiver(username, password,host,port,ssl) {
	this.username=username;
	this.password=password;
	this.port=port||993
	this.ssl=ssl||true;

	var _imap = new Imap({
	  user: '245521957@qq.com',
	  password: 'jtnoxtpestzcbheb',
	  host: 'imap.qq.com',
	  port: 993,
	  tls: true
	});
	_imap.once('ready', function () {
		console.log("连接成功")

	})
	_imap.once('error', function (err) {
	  console.log(err)
	})

	_imap.once('end', function () {
	  console.log('Connection ended')
	})
	_imap.connect();
}
//获取所有的miall
MailReceiver.prototype.getAllMails=function(){

}
//search
MailReceiver.prototype.search=function(search){

}
module.exports = MailReceiver;

