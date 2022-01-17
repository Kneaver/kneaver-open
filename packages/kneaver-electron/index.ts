// this will be executed from index.js

import path from 'path';
import fs from 'fs';

import { app, BrowserWindow } from 'electron';
// if debug #TODO
import installExtension from 'electron-devtools-installer';
import { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
// import { enableLiveReload } from 'electron-compile';
// endif

// insider is the protocol to communicate between the main node process and the browser window, like http
import RegisterInsider from "kneaver-electron-helpers/insider";
import { protocol} from 'electron';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

import getConfig from './config';
import KNVSrvConn from 'kneaver-core';

import APIInstall from './api';

async function main( cmd = "~/kneaver")
{
  const config = getConfig( cmd);

  const isDevMode = process.execPath.match(/[\\/]electron/);

  // import WebpackConnect from './webpack-connect';

  const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: isDevMode?1500:800,
      height: 600,
      webPreferences: {
        plugins: true,
        allowRunningInsecureContent: true,
        webSecurity: false, // no cors
        nodeIntegration: false,
        // avoid starting app and using node in main windows preload
        preload: path.join(__dirname, "./preload.js"),
      }
    });

    // and load the index.html of the app.
    mainWindow.loadURL("insider://localhost/");

    // #TODO if debug
    // Open the DevTools.
    if (isDevMode) {
      // await installExtension(REACT_DEVELOPER_TOOLS);
      mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  };

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.

  /*
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
  } from ;
  */

  // #TODO use Auth, in request
  const userName = (config.Kneaver.userMap?config.Kneaver.userMap[ process.env.USER]:null) || process.env.USER || "Unknown User";
  const User = { userId: "e47c9232-2c66-4d3b-86ec-604512f3e917", name: userName};
  // Or log it directly here, once for the session
  // or do the GetSrv once for all, faster
  // one day the server can be remote
  const KNVSrvConn1 = new KNVSrvConn();
  await KNVSrvConn1.Connect( config);
  /*
  const KNVSession = KNVSrvConn1.GetSrv( cmdValue, function( Updates){
    !! Updates is KNSrv, not the data
    if (mainWindow)
      mainWindow.webContents.send('updates', JSON.stringify( Updates));
  });
  */

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
  
    RegisterInsider( __dirname + "/node_modules/kneaver-ui", ( url, callback) => {
      // This is ExtraFilter in RegisterInsider, not callback
      // uploadData UploadData[]
      // let url = url.replace( /^insider:\/\//, "");
      if ( [ "index.html", "app.js", "fee66e712a8a08eef5805a46892932ad.woff", "af7ae505a9eed503f8b8e6982036873e.woff2", "b06871f281fee6b241d60582ae9369b9.ttf" ].includes( url))
      {
        // must be absolute path
        if ( url == "app.js")
          url = "app-electron.js";
        let resolvedPath = __dirname + "/" + "node_modules/kneaver-ui/dist/" + url;
        // if ( !fs.existsSync( resolvedPath) || !fs.statSync(resolvedPath).isFile())
        callback( resolvedPath);
        return true;
      }
      if ( url == "Templates/dist/templates.bundle.js")
      {
        // from packages/kneaver-core/ProcessTemplates.ts
        // #TODO parametrize properly
        let resolvedPath = path.join( config.Kneaver.rootTemplates, url);
        callback( resolvedPath);
        return true;
      }
      else
      {
      }
      // 
      // 
      return false;

    }, false);
    // This is to ensure KNVSrv is ready when we start with sqlite
    setTimeout( () => { 
      createWindow()
    }, 1000);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

  const ipcMain = require('electron').ipcMain;
  ipcMain.on('closeApp', (event, close) => {
  });

  ipcMain.on('CloseWindow', () => {
  });

  APIInstall( ipcMain, KNVSrvConn1, User);
}

import { Command } from 'commander';
const program = new Command();

program
  .version('2.0.70')
  .usage('[options] <file>')
  .arguments('[cmd] [env]')
  .action(  (cmd, env, project) => {
    console.log( cmd, env, project);
    main( cmd);
  })
  .command('kneaver-electron <path>', 'launch Kneaver Thinking Box on a project')
  .option( '--servername <serverName>', 'servername')
  .option( '--remoteuser <remoteuser>', 'remoteuser')
  .option( '--debug', 'debug')
  .option( '--maxidle <maxidle>', 'maxidle')
  .parse( process.argv);
