
import path from 'path';
import fs from 'fs';
import {} from 'kneaver-stdjs/KNVBase';

import Router from 'kneaver-electron-helpers/router';
import routesMount from 'kneaver-core/routes';

export default function APIInstall( ipcMain, KNVSession, user) {
  // Event handler for synchronous incoming messages
  // https://www.tutorialspoint.com/electron/electron_inter_process_communication.htm

  function GetSrvAndReply( User, response, action) {
    let ret = KNVSession.GetSrv( User, 0, action);
    return ret.then( res => {
      // be explicit in status otherwise result of send is used as status and breaks
      if ( res === null)
        return Router.WrapNope();
      else
        return Router.WrapIntoJSON( res);
    }
    ,
    err => {
      console.error( err);
      return Router.WrapFailure( 500, 'Internal Server Error:' + err.error);
    });
  }

  // caller in ipcRenderer must send a fixed channel
  const route = "/items" ; // "/items,"
  const router = new Router( route);

  ipcMain.handle( route, async (event, arg) => {
    const req = { user, ...arg, body: JSON.parse(arg.body)};
    return router.findAndCall( req);
  });

  routesMount( router,  GetSrvAndReply);

}