const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const {UglifyJsPlugin} = require('webpack').optimize;
const {AotPlugin} = require('@ngtools/webpack');
const minimizeCss = true;
const baseHref = "";
const deployUrl = "";
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {DefinePlugin} = require('webpack');
const commonConfig = require('./webpack.config.common');
const merge = require('webpack-merge');
const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    preset: ['default', {
      //autoprefixer: false,
      safe: true,
      //mergeLonghand: false,
      discardComments: {remove: (comment) => !importantCommentRe.test(comment)},
      //discardDuplicates: true
    }]
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        }
        else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
        else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

const environmentFiles = {
  'dev': 'environments/environment.ts',
  'stag': 'environments/environment.stag.ts',
  'prod': '/src/environments/environment.prod.ts'
};
const envFile= environmentFiles['prod'];

let exported = merge(commonConfig,
  {
    "entry": {
      "main": [
        "./src/main.ts",
        "./src/assets/sass/main.scss"
      ],
      "polyfills": [
        "./src/polyfills.ts"
      ],
      "vendor": [
        "./src/assets/css/styles.css"
      ]
    },
    "output": {
      "path": path.join(process.cwd(), "dist"),
      "filename": "[name].[hash].bundle.js",
      "chunkFilename": "[id].chunk.js"
    },
    "module": {
      "rules": [
        {
          "test": /\.css$/,
          "use": ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                "loader": "css-loader",
                "options": {
                  "sourceMap": false,
                  "importLoaders": 1,
                }
              },
              {
                "loader": "postcss-loader",
                "options": {
                  "ident": "postcss",
                  "plugins": postcssPlugins
                }
              }
            ]
          })
        },
        {
          "test": /\.scss$|\.sass$/,
          "use": ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                "loader": "css-loader",
                "options": {
                  "sourceMap": false,
                  "importLoaders": 2
                }
              },
              {
                "loader": "postcss-loader",
                "options": {
                  "ident": "postcss",
                  "plugins": postcssPlugins
                }
              },
              {
                "loader": "sass-loader",
                "options": {
                  "sourceMap": false,
                  "precision": 8,
                  "includePaths": []
                }
              }
            ]
          })
        },
      ]
    },
    "plugins": [
      new DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('prod')
        }
      }),
      new AotPlugin({
        "mainPath": __dirname + "/src/main.aot.ts",
        "replaceExport": false,
        "hostReplacementPaths": {
          "/src/environments/environment.ts": envFile
        },
        "exclude": [],
        "tsConfigPath": __dirname + "/tsconfig-aot.json",
        "skipCodeGeneration": true,
        "entryModule": __dirname + "/src/app/app.module#AppModule",
      }),
      new ExtractTextPlugin({allChunks: true, filename: 'stylesheets/[name].[contenthash].css'}),
      //new UglifyJsPlugin()
    ],
    "node": {
      "fs": "empty",
      "global": true,
      "crypto": "empty",
      "tls": "empty",
      "net": "empty",
      "process": true,
      "module": false,
      "clearImmediate": false,
      "setImmediate": false
    },
    "devServer": {
      "historyApiFallback": true
    }
  });

module.exports = function (env, args) {
  return exported;
};
