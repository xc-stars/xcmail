
(function () {
  const imap = require('../src/imap-client')
  const fs = require('fs')
  var filedir = "static/emails/"
  var str = ""
  var mailDivDom = document.createElement("div")
  var files = fs.readdirSync(filedir)
  function connectToServer(){
    imap.connect();
  }
}())
