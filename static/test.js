var testBtn
window.onload=function () {
	testBtn=document.querySelector('#test');
	const BrowserWindow = require('electron').remote.BrowserWindow
	const ipcRenderer = require('electron').ipcRenderer
	testBtn.addEventListener('click',function(){
	// var win = new BrowserWindow({ width: 800, height: 600, show: false })
	// win.on('closed', function () {
	//   win = null
	// })

	// win.loadURL('https://baidu.com')
	// win.show()
	ipcRenderer.send('test','this is test txt')
	});
}
