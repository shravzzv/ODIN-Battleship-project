const path = require('path')

module.exports = {
  entry: './src/Gameloop.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },
}
