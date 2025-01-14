const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

app.on('ready', () => {
    // Lancer le backend Java
    backendProcess = spawn('java', ['-jar', './backend/my-backend-app.jar']);

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend stopped with code ${code}`);
    });

    // Créer la fenêtre principale
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true, // Permet d'utiliser Node.js dans le front
        },
    });

    mainWindow.loadFile('pages/pageConnection.html');
});

app.on('window-all-closed', () => {
    if (backendProcess) backendProcess.kill(); // Arrêter le backend lorsque l'application se ferme
    app.quit();
});