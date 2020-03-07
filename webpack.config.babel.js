import { join } from 'path';

const include = join(__dirname, 'src');

export default {
  entry: './src/syncState',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'reduxStateSync',
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', include },
    ],
  },
};
