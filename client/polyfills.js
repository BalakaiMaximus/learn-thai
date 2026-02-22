// Node.js polyfills for React Native
import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';
import { Platform } from 'react-native';

// Set up global polyfills
global.Buffer = Buffer;
global.process = global.process || { env: {} };

// Make sure Buffer is available everywhere
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// TextEncoder/TextDecoder polyfills for Solana Mobile Wallet Adapter
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// EventTarget polyfill for wallet adapter
if (typeof global.EventTarget === 'undefined') {
  global.EventTarget = class EventTarget {
    constructor() {
      this._listeners = {};
    }
    
    addEventListener(type, listener) {
      if (!this._listeners[type]) {
        this._listeners[type] = [];
      }
      this._listeners[type].push(listener);
    }
    
    removeEventListener(type, listener) {
      if (this._listeners[type]) {
        const index = this._listeners[type].indexOf(listener);
        if (index !== -1) {
          this._listeners[type].splice(index, 1);
        }
      }
    }
    
    dispatchEvent(event) {
      if (this._listeners[event.type]) {
        this._listeners[event.type].forEach(listener => {
          listener(event);
        });
      }
      return true;
    }
  };
}

// CustomEvent polyfill
if (typeof global.CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail || null;
      this.bubbles = options.bubbles || false;
      this.cancelable = options.cancelable || false;
    }
  };
}

// Fix for TurboModuleRegistry PlatformConstants error
if (global.TurboModuleRegistry) {
  try {
    // Mock PlatformConstants if it doesn't exist
    const PlatformConstants = global.TurboModuleRegistry.get('PlatformConstants');
    if (!PlatformConstants) {
      global.TurboModuleRegistry.get = (name) => {
        if (name === 'PlatformConstants') {
          return {
            getConstants: () => ({
              isTesting: false,
              reactNativeVersion: { major: 0, minor: 75, patch: 2 },
              Version: Platform.Version,
              OS: Platform.OS,
              ...Platform.constants,
            }),
          };
        }
        return global.TurboModuleRegistry.getEnforcing(name);
      };
    }
  } catch (e) {
    // Fallback: disable TurboModuleRegistry if it causes issues
    console.log('TurboModuleRegistry polyfill failed:', e);
  }
}

export default {};