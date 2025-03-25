export default {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true,
        layers: true, // Add this line to enable layers
      };
    }
    return config;
  },
};
