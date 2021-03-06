const path = require('path')
const webpack = require('webpack')
const { AutoRoutesWebpackPlugin, AutoZipWebpackPlugin } = require('./webpackPlugin')
const { publicPath, distDir, zipName, zipOutputPath, srcDir } = require('./paths')

let proxies = []
let proxy = {}
// let proxiesPath = path.join(__dirname, '../src/utils/proxies')
// fs.readdirSync(proxiesPath).forEach(file => file !== 'enums.js' && proxies.push(require(`${proxiesPath}/${file}`)))
// proxies.forEach(p => Object.keys(p).forEach(k => proxy[k] = p[k]))

module.exports = (env, argv) => {
  let config = {
    devServer: {
      // contentBase: path.join(__dirname, '../dist'),
      historyApiFallback: {
        index: publicPath,
      },
      compress: true,
      host: '127.0.0.1',
      port: 9001,
      hot: true,
      // proxy,
      publicPath,
      // writeToDisk: true,
    },

    devtool: 'cheap-module-eval-source-map',

    optimization: {
      minimize: false,
    },

    plugins: [
      new webpack.DefinePlugin({
        HTTP_ENV: JSON.stringify('development'),
      }),
    ],
  }

  if (argv.isDevServer) {
    config.plugins.push(new AutoRoutesWebpackPlugin({
      routesPath: path.join(srcDir, '/config/routes.ts'),
      pagesPath: path.join(srcDir, '/pages'),
    }))
  } else {
    config.plugins.push(new AutoZipWebpackPlugin({
      filename: zipName,
      entry: distDir,
      outputPath: zipOutputPath,
    }))
  }

  return config
}
