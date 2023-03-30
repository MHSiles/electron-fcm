const {
  app,
  BrowserWindow,
  screen: electronScreen,
  ipcMain,
} = require("electron");
const path = require("path");
const { setup: setupPushReceiver } = require('electron-push-receiver');
const Store = require('electron-store');

// Set the start URL to the default
let startURL = "http://localhost:3000/";

const store = new Store();

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width,
    height: electronScreen.getPrimaryDisplay().workArea.height,
    show: false,
    backgroundColor: "white",
    webPreferences: {
      preload: path.join(__dirname, "./renderer.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {x: 13, y: 15},
  });

  // For debugging purposes
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(startURL);

  // Setup push receiver
  setupPushReceiver(mainWindow.webContents);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  });

  return mainWindow
};

app.whenReady().then(() => {
  let mainWindow;

  if(!mainWindow) {
    mainWindow = createMainWindow();
  } else {
    mainWindow.show();
  }

  ipcMain.on("storeFCMToken", (e, token) => {
    store.set('fcm_token', token);
  });

  ipcMain.on("getFCMToken", async (e) => {
    e.sender.send('getFCMToken', store.get('fcm_token'));
  });
});

// Triggers when quitting manually or by CMD+Q -> Actually quits the app.
app.on('before-quit', () => allowQuitting = true);