// using webpack to prepare a build with few dependency for quick install on docker
import path from 'path';
// import nodeExternals from 'webpack-node-externals';
import { rulesFct, normalizePort, aliases, MakeSSR } from 'kneaver-dot/webpack.config.base.js';
const rules = rulesFct(null);

module.exports = ( env, argv) => {
  let mode = 'production';
  if ( argv && argv.mode)
    mode = argv.mode;
  else
  if ( env && env.production )
      mode = 'production';
    else
      mode = 'development';

  return {
    mode: mode,
    context: __dirname,
    entry: {
      main: './index.ts',
    },
    target: 'node',
    output: {
      // path: path.join(__dirname, 'build'),
      path: __dirname,
      filename: '[name].js'
    },
    resolve:
    {
      extensions: [ '.js', '.mjs', '.jsx', '.es6', '.json', '.ts', '.tsx'],
    },
    module:
    {
      // for iconv, cf https://github.com/webpack/webpack/issues/3078
      // noParse: /sqlite3\.js|mongoskin|mysql|pg\-native|pg|socket\.io/,

      // for iconv, cf https://github.com/webpack/webpack/issues/3078
      noParse: /iconv-loader\.js/,
      rules: [
        // Javascript
        rules.tsx,
        rules.jsx,
        // for graphql
        rules.mjs,
        rules.css,
        rules.scss,
        rules.json,
        rules.woff,
        rules.ttf,
        rules.svg,

      ]
    },
    output: {
      publicPath: '/',
    },
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,   // if you don't put this is, __dirname
      __filename: false,  // and __filename return blank or /
    },
    // externals: [nodeExternals()], // Need this to avoid error when working with Express  
    optimization : { minimize : false },
    externals: {
      'pg': 'require("pg")',
      'sqlite3': 'require("sqlite3")',
      'socket.io': 'require("socket.io")'
    }
    //[nodeExternals()], // in order to ignore all modules in node_modules folder
  }
}