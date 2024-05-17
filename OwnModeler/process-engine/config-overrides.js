module.exports = function override(config) {
    config.module.rules.push({
      test: /\.cjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    });
  
    return config;
  }