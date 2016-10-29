var Imap = require('imap'),
  inspect = require('util').inspect

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
  var receiver = new MailReceiver({username: account.username,password: account.password,host: account.host,port: account.port,ssl: account.ssl})
  receiver.imap.once('error', function (err) {
    console.log(err)
    fn(err, receiver)
  })
  receiver.imap.once('ready', function () {
    console.log('连接成功')
    fn(null, receiver)
  })
  receiver.imap.connect()
}

// 获取所有的miall的To,SUBJECT DATA
MailReceiver.prototype.getAllMails = function (fn) {
  var that = this
  that.openInbox(function (err, box) {
    if (err) throw err
    var f = that.imap.seq.fetch('1:2', {
      markSeen: true,
      size: true,
      // bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
      struct: true
    })
    f.on('message', function (msg, seqno) {
      console.log('Message #%d', seqno)
      var prefix = '(#' + seqno + ') '

      msg.on('body', function (stream, info) {
        console.log('----------------------------------------------')
        console.dir(info)
        console.log('----------------------------------------------')
        var buffer = ''
        stream.on('data', function (chunk) {
          buffer += chunk.toString('utf8')
        })
        stream.once('end', function () {
          console.log('end--------------------------------------' + info.which)
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)))

          // if (info.which === 'TEXT')
          // 	fn(buffer)
          // else
          fn(Imap.parseHeader(buffer))
        })
      })
      msg.once('attributes', function (attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8))
      })
      msg.once('end', function () {
        console.log(prefix + 'Finished')
      })
    })
    f.once('error', function (err) {
      console.log('Fetch error: ' + err)
    })
    f.once('end', function () {
      console.log('Done fetching all messages!')
    // imap.end()
    })
  })
}

//	标记邮件为已读
MailReceiver.prototype.markMailSeen = function (seqno) {
  var that = this
  this.openInbox((err, box) => {
    if (err) {
      throw err
    }
    that.imap.seq.setFlags(seqno, ['Seen'], (err) => {
      if (err) {
        throw err
      }
    })
  })
}

// search
MailReceiver.prototype.search = function (search) {
  var that = this
  that.openInbox((err, box) => {
    if (err) throw err
    that.imap.search([ 'NEW', ['ON', 'April 20, 2010']], function (err, results) {
      console.log(results)
      console.log(results.length)
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
MailReceiver.prototype.openInbox = function (cb) {
  this.imap.openBox('INBOX', true, cb)
}

module.exports = MailReceiver
