const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for @solana packages
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  stream: 'readable-stream',
  buffer: '@craftzdog/react-native-buffer',
  events: 'events',
  util: 'util',
};

config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main', 'module'];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Add custom resolver for @solana packages to handle .native.mjs files
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Transform configuration to handle ES modules properly
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add custom resolver to handle @solana package issues
const originalResolverResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @solana packages with .native.mjs issues
  if (moduleName.includes('@solana/') && moduleName.includes('.native.mjs')) {
    // Replace .native.mjs with .node.cjs for @solana packages
    const fixedModuleName = moduleName.replace('.native.mjs', '.node.cjs');
    try {
      return originalResolverResolveRequest ? 
        originalResolverResolveRequest(context, fixedModuleName, platform) : 
        context.resolveRequest(context, fixedModuleName, platform);
    } catch (error) {
      // If that fails, try without any extension
      const baseModuleName = moduleName.replace(/\.(native\.mjs|node\.mjs|mjs)$/, '');
      return originalResolverResolveRequest ? 
        originalResolverResolveRequest(context, baseModuleName, platform) : 
        context.resolveRequest(context, baseModuleName, platform);
    }
  }
  
  return originalResolverResolveRequest ? 
    originalResolverResolveRequest(context, moduleName, platform) : 
    context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
