// Environment configuration for React Native client
import Constants from 'expo-constants';

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production';
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  SOLANA_RPC_URL: string;
  SERVER_URL: string;
  APP_VERSION: string;
}

// Determine environment
const getEnvironment = (): 'development' | 'production' => {
  // In React Native, check for __DEV__ global
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'development';
  }
  
  // For web builds, check NODE_ENV
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV as 'development' | 'production';
  }
  
  // Default to development for safety
  return 'development';
};

const NODE_ENV = getEnvironment();
const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Derive app version from Expo config, falling back to app.json if needed
const deriveAppVersion = (): string => {
  const fromConstants = (Constants?.expoConfig as any)?.version || (Constants?.manifest2 as any)?.extra?.expoClient?.version;
  if (fromConstants) return String(fromConstants);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appJson = require('../app.json');
    return appJson?.expo?.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
};

const APP_VERSION = deriveAppVersion();

// Environment-specific configuration
export const config: EnvironmentConfig = {
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  APP_VERSION,
  
  // Solana RPC configuration
  SOLANA_RPC_URL: IS_PRODUCTION 
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com',
  
  // Server configuration
  SERVER_URL: IS_PRODUCTION
    ? 'https://learn-thai-api.onrender.com'  // Production Render URL
    : 'http://localhost:5001',  // Local development
};

// Export environment helpers
export const isDevelopment = () => config.IS_DEVELOPMENT;
export const isProduction = () => config.IS_PRODUCTION;
export const getServerUrl = () => config.SERVER_URL;

// Environment-specific logging
export const envLog = (message: string, ...args: any[]) => {
  if (config.IS_DEVELOPMENT) {
    console.log(`[${config.NODE_ENV.toUpperCase()}] ${message}`, ...args);
  }
};

// Environment info for debugging
export const getEnvironmentInfo = () => ({
  environment: config.NODE_ENV,
  solanaNetwork: config.IS_PRODUCTION ? 'mainnet-beta' : 'devnet',
  serverUrl: config.SERVER_URL,
  appVersion: config.APP_VERSION,
});