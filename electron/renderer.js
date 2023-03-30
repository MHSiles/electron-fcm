const { contextBridge, ipcRenderer } = require("electron");
// this will end up on the window object in the react app (ie `window.electron.sendNotification()` )
contextBridge.exposeInMainWorld("electron", {
  isElectron: true, // if window.electron exists, it's electron, but lets include this as well
  getFCMToken: (channel, func) => {
    ipcRenderer.once(channel, func);
    ipcRenderer.send("getFCMToken");
  },
});

// Listen for service successfully started
ipcRenderer.on('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', (_, token) => {console.log('FCM service started')})
// Start the service
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED", (_, token) => ipcRenderer.send('storeFCMToken', token))
// Handle notification errors
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR", (_, error) => {console.log(error)})
// Store the new token
ipcRenderer.on("PUSH_RECEIVER:::TOKEN_UPDATED", (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', { 
    payload: token
   });
  window.dispatchEvent(event);
})
// Display notification
ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_RECEIVED', (_, serverNotificationPayload) => {console.log(serverNotificationPayload)});

// FCM sender ID from FCM console
const senderId = '334679765697'
ipcRenderer.send('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', senderId)