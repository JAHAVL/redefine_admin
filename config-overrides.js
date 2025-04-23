const path = require('path');

module.exports = function override(config, env) {
  // Fix for the HTML webpack plugin to find the index.html file
  // when running in Docker environment
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      // Update the template path to be relative to the current directory
      plugin.options.template = path.resolve(__dirname, 'public/index.html');
    }
  });

  // Add resolve fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "crypto": require.resolve("crypto-browserify")
  };

  // Improve module resolution in Docker environment
  config.resolve.modules = [
    path.resolve(__dirname, 'src'),
    'node_modules'
  ];

  // Add alias for direct imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@widgets': path.resolve(__dirname, 'src/widgets'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@routes': path.resolve(__dirname, 'src/routes'),
  };

  return config;
};
