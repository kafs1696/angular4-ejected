const {SourceMapDevToolPlugin} = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');
const exports = merge(commonConfig,
  {
    "module": {
      "entry": {
        "main": [
          "./src/main.ts"
        ],
        "polyfills": [
          "./src/polyfills.ts"
        ],
        "styles": [
          "./src/styles.css"
        ]
      },
      "rules": [
        {
          "test": /\.css$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
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
        },
        {
          "test": /\.scss$|\.sass$/,
          "use": [
            "style-loader",
            {
              "loader": "css-loader",
              "options": {
                "sourceMap": false,
                "importLoaders": 1
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
        },
        {
          "test": /\.ts$/,
          "loader": "@ngtools/webpack"
        },
        {
          test: /\.ts$/,
          enforce: 'post',
          include: path.resolve('src'),
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true,
            produceSourceMap: true
          },
          exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
        }
      ]
    },
    "plugins": [
      new SourceMapDevToolPlugin({
        "filename": "[file].map[query]",
        "moduleFilenameTemplate": "[resource-path]",
        "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
        "sourceRoot": "webpack:///",
        exclude: ['vendor.js']
      }),
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
      "historyApiFallback": true,
      "compress": true,
      "port": 8080,
    }
  });
module.exports = function (env, args) {
  return exports
};
