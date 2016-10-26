const Imap = require('imap')
const {inspect} = require('util')
const fs = require('fs')
const {MailParser} = require('mailparser')
const Promise = require('promise')


let imap = new Imap({
  user: '779427354@qq.com',
  password: 'patrick1234',
  host: 'imap.qq.com',
  port: 993,
  tls: true
})



function openInbox (cb) {
  imap.openBox('INBOX', true, cb)
}

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err
    imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2016'] ], function (err, results) {
      if (err) throw err
      var f = imap.fetch(results, { bodies: '' })
      f.on('message', function (msg, seqno) {
        msg.on('body', function (stream, info) {
          // let mailparser = new MailParser()
          // stream.pipe(mailparser)
          // mailparser.on("end",function( mail ){
            // fs.writeFile('msg-' + seqno + '-body.eml', mail.html, function (err) {
          //     if (err) throw err;
          //     console.log(seqno + 'saved!');
          //   });
          // })
          stream.pipe(fs.createWriteStream('static/emails/msg-' + seqno + '-body.eml'))

        })
        // msg.once('attributes', function (attrs) {
        //   var tmp = document.createElement("div")
        //   tmp.innerText = prefix + inspect(attrs, true, 8);
        //   mailbox.appendChild(tmp)
        // })
        msg.once('end', function () {
          console.log(prefix + 'Finished')
        })
      })
      f.once('error', function (err) {
        console.log('Fetch error: ' + err)
      })
      f.once('end', function () {
        console.log('Done fetching all messages!')
        imap.end()
      })
    })
  })
})

imap.once('error', function (err) {
  console.log(err)
})

imap.once('end', function () {
  console.log('Connection ended')
})

module.exports = imap
