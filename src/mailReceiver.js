var Imap = require('imap'),
inspect = require('util').inspect;

//初始化imap
function MailReceiver(account) {
	this.username = account.username;
	this.password = account.password;
	this.host = account.host||"imap.qq.com";
	this.port = account.port||993
	this.ssl = account.ssl||true;

	this.imap= new Imap({
	  user: this.username,
	  password: this.password,
	  host: this.host,
	  port: this.port,
	  tls: this.ssl
	});
	
	this.imap.on('error', function (err) {
	  console.log(err)
	  console.log(111111)
	})

	this.imap.on('end', function () {
	  console.log('Connection ended')
	})
	this.imap.on('ready',function(){
		console.log('链接成功');
	})
}
//login
MailReceiver.prototype.login=function(fn){
	this.imap.once('ready', function () {
		console.log("连接成功")
		fn();
	})
	this.imap.connect();
}
//获取所有的miall
MailReceiver.prototype.getAllMails=function(fn){
	var that=this;
	that.openInbox(function(err, box) {
		if (err) throw err;
		var f = that.imap.seq.fetch('1:3', {
			bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
			struct: true
		});
		f.on('message', function(msg, seqno) {
			console.log('Message #%d', seqno);
			var prefix = '(#' + seqno + ') ';
			msg.on('body', function(stream, info) {
				var buffer = '';
				stream.on('data', function(chunk) {
					buffer += chunk.toString('utf8');
				});
				stream.once('end', function() {
					console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
				});
			});
			msg.once('attributes', function(attrs) {
				console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
			});
			msg.once('end', function() {
				console.log(prefix + 'Finished');
			});
		});
		f.once('error', function(err) {
			console.log('Fetch error: ' + err);
		});
		f.once('end', function() {
			console.log('Done fetching all messages!');
			// imap.end();
		});
	});

}

//search
MailReceiver.prototype.search=function(search){
	
}
//login
MailReceiver.prototype.openInbox=function(cb) {
  this.imap.openBox('INBOX', true, cb);
}

module.exports = MailReceiver;
