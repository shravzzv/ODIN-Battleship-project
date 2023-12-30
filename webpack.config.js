const path = require('path')

module.exports = {
  entry: './src/Gameloop.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|mp3|wav|ogg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
}
