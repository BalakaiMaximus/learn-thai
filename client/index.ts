// Import polyfills FIRST
import './polyfills';

import { registerRootComponent } from 'expo';
import EntryApp from './EntryApp';

// Always use registerRootComponent for Expo compatibility
registerRootComponent(EntryApp);

// Export for metro bundler
export default EntryApp;
