var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

require('dotenv').load();

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(8000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening on port 8000');
});
