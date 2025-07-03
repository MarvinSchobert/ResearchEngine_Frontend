module.exports = {
  webpack: 
  (config) => {
    config.module.rules.push({
      test: /\.cjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    })
    return config;
  },
  devServer: (configFunction) => 
    (proxy, allowedHost) => {
      // Create the default devServer config by calling configFunction with the 
      // CRA proxy/allowedHost parameters
      const devServerConfig = configFunction(proxy, allowedHost);

     // Set your customisation for the dev server
     devServerConfig.allowedHosts = [
      '.loca.lt'
    ];
    return devServerConfig;
  }
};  