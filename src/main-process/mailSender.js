const nodemailer = require('nodemailer')

function MailSender (opt) {
  var opt = opt || {}

  this.config = {
    host: opt.host || 'smtp.' + opt.username.split('@')[1],
    port: opt.port || '25',
    auth: {
      user: opt.username,
      pass: opt.password
    }
  }
  this.transporter = nodemailer.createTransport(this.config)
}

MailSender.prototype.send = function (mailOptions, fn) {
  this.transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    }
    fn(info)
  })
}

module.exports = MailSender
