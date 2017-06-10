const Imap = require('imap')
const {inspect} = require('util')
const {MailParser} = require('mailparser')

// 初始化imap
function MailReceiver (account) {
  this.username = account.username
  this.password = account.password
  this.host = account.host || 'imap.qq.com'
  this.port = account.port || 993
  this.ssl = account.ssl || true

  this.imap = new Imap({
    user: this.username,
    password: this.password,
    host: this.host,
    port: this.port,
    tls: this.ssl
  })

  this.imap.on('end', function () {
    console.log('Connection ended')
  })
// this.imap.on('ready',function(){
// 	console.log('链接成功')
// })
}
// login
MailReceiver.login = function (account, fn) {
  console.log(account)
  var receiver = new MailReceiver({username: account.username, password: account.password, host: account.host, port: account.port, ssl: account.ssl})
  receiver.imap.once('error', function (err) {
    if (err) {
      throw err
    }
    fn(err, receiver)
  })
  receiver.imap.once('ready', function () {
    console.log('Connect successed!')
    fn(null, receiver)
  })
  receiver.imap.connect()
}

// 获取某个文件夹内的所有的miall的FROM,SUBJECT,DATA
MailReceiver.prototype.getMailsHeader = function (boxname, fn) {
  var that = this
  var headers = []

  that.openBox(boxname, (err, box) => {
    if (err) throw err
    	 var f = that.imap.fetch('1:*', {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)'],
      struct: true
    })
    f.on('message', (msg, seqno) => {
      var obj = {}
      console.log(seqno)
      msg.on('body', (stream, info) => {
    	
				var buffer = '';
				stream.on('data', function(chunk) {
				  buffer += chunk.toString('utf8');
				});
				stream.once('end', function() {
					var header=Imap.parseHeader(buffer)
				  // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
				  obj.header = header
				});
      })
      msg.once('attributes', (attributes) => {
        obj.attributes = attributes
      })
      msg.once('end', () => {
        headers.push(obj)
      })
    })
    f.once('error', (err) => {
      throw err
    })
    f.once('end', () => {
      fn(headers)
      console.log('Done fetching all messages!')
    // imap.end()
    })
  })
}

// 更具uid得到邮件内容
MailReceiver.prototype.getMail = function (uid, markSeen, fn) {
  var that = this
  this.openBox('INBOX', (err, box) => {
    if (err) {
      throw err
    }
    var f = that.imap.fetch([uid], {
      markSeen: markSeen,
      bodies: ''
    })
    f.on('message', (msg, seqno) => {
      msg.on('body', (stream, info) => {
        var mailparser = new MailParser()
        stream.pipe(mailparser)
        mailparser.on('end', (mail) => {
          fn(mail)
        })
      })
    })
    f.once('error', (err) => {
      throw err
    })
    f.once('end', () => {
      console.log('Done fetching all messages!')
    })
  })
}

//	标记邮件为已读
MailReceiver.prototype.markMailSeen = function (uid) {
  var that = this
  this.openBox('INBOX', (err, box) => {
    if (err) {
      throw err
    }
    that.imap.setFlags([uid], ['\\Seen'], (err) => {
      if (err) {
        throw err
      }
      console.log(err)
    })
  })
}

// 得到所有的文件夹
MailReceiver.prototype.getAllBoxes = function (fn) {
  this.imap.getBoxes('', (err, boxes) => {
    if (err) {
      throw err
    }
    fn(boxes)
  })
}

// login
MailReceiver.prototype.openBox = function (boxname, cb) {
  this.imap.openBox(boxname, true, cb)
}

module.exports = MailReceiver
