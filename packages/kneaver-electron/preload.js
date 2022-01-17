
/*
from https://github.com/electron/electron/blob/main/docs/api/browser-window.md
preload Specifies a script that will be loaded before other scripts run in the page. 
This script will always have access to node APIs no matter whether node integration is turned on or off. 
The value should be the absolute file path to the script. 
When node integration is turned off, the preload script can reintroduce Node global symbols back to the global scope. 
See example here.https://github.com/electron/electron/blob/main/docs/api/context-bridge.md#exposing-node-global-symbols
*/
// preload.js
// Bad practice to have electron visible in the DOM when a part of the content is taken from outside
window.module = null; // module;
module = undefined;

// ^premload.js is not a module and can't use import
const fetch = require( 'kneaver-electron-helpers/fetch');
const electron = require( 'electron');
const contextBridge = electron.contextBridge;
contextBridge.exposeInMainWorld('fetchAPI', fetch( electron.ipcRenderer, "/api" )); // "electron://q/api"))
