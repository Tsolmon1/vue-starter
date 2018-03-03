const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProd = process.env.NODE_ENV === 'production';
// Load application config through node-config
// The double JSON.stringify is necessary, the first stringify returns a String
// representation of the object, the second stringify creates valid JSON.
process.env["NODE_CONFIG_DIR"] = __dirname + "/../src/app/config";
const envConfig = JSON.parse(process.env.CONFIG || '{}');
const appConfig = JSON.stringify(JSON.stringify(Object.assign({}, require('config'), envConfig)));

const baseConfig = {
  stats:   {
    assets:   true,
    children: true,
  },
  devtool: isProd ? '#source-map' : '#eval-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json', '.node', '.scss'],
    modules:    [
      path.join(__dirname, '..', 'src'),
      path.join(__dirname, '..', 'node_modules'),
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.DefinePlugin({
                               PRODUCTION:             isProd,
                               DEVELOPMENT:            !isProd,
                               'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                               APP_CONFIG:             appConfig,
                             }),
  ],
  module:  {
    rules: [
      {
        test:    /\.vue$/,
        loader:  'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
          postcss: [
            require('autoprefixer')({ browsers: ['last 2 versions', 'ie >= 11'] }),
            require('css-mqpacker')(),
            require('cssnano')({
                                 discardComments: {
                                   removeAll: true,
                                 },
                                 zindex:          false,
                               }),
          ],
        },
      },
      {
        test:    /\.ts?$/,
        loader:  'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test:    /\.(?:jpg|png|svg|ttf|woff2?|eot|ico)$/,
        loader:  'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
};

if (process.env.ANALYZE) {
  baseConfig.plugins.push(
    new BundleAnalyzerPlugin({
                               analyzerMode: 'static',
                             }),
  );
}

module.exports = baseConfig;
