// Karma + Jasmine configurado con Webpack para React/JSX
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests/**/*.spec.js', watched: true },
      { pattern: 'tests/**/*.spec.jsx', watched: true },
    ],
    preprocessors: {
      'tests/**/*.spec.js': ['webpack', 'sourcemap'],
      'tests/**/*.spec.jsx': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },
    reporters: ['spec'],
    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: true,
    },
    browsers: ['ChromeHeadless'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};