import os from 'os';
import path from 'path';
import fs from 'fs';

export default function getConfig( projectPath, serverName = null)
{
  
  let config = {
    Kneaver: {
      rootTemplates: null,
      userMap : {},
    }
  };

  try
  {

    const loadJSON = path => {
      try
      {
        return JSON.parse( fs.readFileSync( path, "utf8"));
      }
      catch (e)
      {
        console.log( "configuration error, badly written configuration file at", path, e );
        throw e;
      }
    };

    if ( fs.existsSync( path.join( __dirname, 'config.json')))
      config = Object.assign( loadJSON( './config.json'));

    if ( fs.existsSync( path.join( projectPath, '.kneaver/config.json')))
      config = Object.assign( loadJSON( path.join( projectPath, '.kneaver/config.json')));

    let SettingsRoot = "/usr/local/websites/KNVSettings";
    if (process.platform == "win32")
      SettingsRoot = "C:\\Inetpub\\KNVSettings";

    if ( fs.existsSync( path.join( SettingsRoot, 'config.json')))
      config = Object.assign( config, loadJSON( path.join( SettingsRoot, 'config.json')));

    if ( serverName)
    {
      const SettingsDirectory = path.join( SettingsRoot, serverName);
      if ( fs.existsSync( path.join( SettingsDirectory, 'config.json')))
        config = Object.assign( config, loadJSON( path.join( SettingsDirectory, 'config.json')));
    }
  }
  catch ( e)
  {
    console.log( "configuration error, check your setup", e );
  }
  return config;
}