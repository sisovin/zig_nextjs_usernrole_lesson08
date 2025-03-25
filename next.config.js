module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true,
      };
    }
    return config;
  },
};
