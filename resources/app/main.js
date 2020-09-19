const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { session } = require('electron'); 
const fs = require('fs');

var launcher_win = undefined;
var main_win = undefined;

function createWindow(html_file, width, height, frame, resizable, nomenu, sudo) {
	return new Promise((successCallback, failureCallback) => {
		// Cree la fenetre du navigateur.
		var win = new BrowserWindow({
		 	width: width,
			height: height,
			frame: frame,
			show: false,
			resizable: resizable,
			titleBarStyle: 'hidden',
			webPreferences: {
				nodeIntegration: true
			}
		})

		if (nomenu == true)
		{
			win.setMenu(null);
		}

		win.setMenu(null);

		// and load the index.html of the app.
	 	win.loadFile(html_file).catch(function(error) {
	 		alert('Failed to load launcher: '+error)
	 	})

		// win.webContents.openDevTools()

	  	win.once('ready-to-show', () => {
	  		setTimeout(function() {
	  			win.show();
	  			successCallback(win);
	  		}, 1000);	
	  	});
  	});

    
}

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
  	try {
	  	if (arg == "start_program")
	  	{
		  	setTimeout(function () {
				createWindow('launcher/program.html', 1400, 1000, true, true, false, false).then(function(win) {
					console.log('Yay')
					launcher_win.close();
					main_win = win;
					ipc.sendSync('synchronous-message', 'mainproc-ready')
				}).catch(function(error) {
				   	console.log('Error: '+error)
				    alert("Failed to stop launcher: "+error+"\n\nMeaxisNetwork Launcher will terminate.");
				})
				      	
			}, 3000);
	  	}

	  	else if (arg == "restart_updater")
	  	{
	    	app.relaunch();
			app.exit();
	  	}

	  	else if (arg == "show_meaxisnetworkchat")
	  	{
	  		main_win.loadURL('https://meaxisnetwork.net/chat/');
	  	}

	  	else if (arg == "show_loginpage")
	  	{
	  		main_win.loadFile('launcher/login.html');
	  	}

	  	else if (arg == "show_indexpage")
	  	{
	  		main_win.loadFile('launcher/index.html');
	  	}
	  	
	} catch(error) {
		fs.writeFileSync('error.txt', error);
	}


})

console.log('Au depart, on demarre !')
// Tchou Tchou, Chuggington!
app.whenReady().then(function() { 
	var win = createWindow('launcher/install.html', 300, 400, false, false, true, true)
	.then(function(lwin) {
		launcher_win = lwin;
	});
});


