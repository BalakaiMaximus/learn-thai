import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate a unique game session ID
export const generateGameSessionId = (): string => {
  return uuidv4();
};

// Check if there's an active game session
export const hasActiveSession = async (): Promise<boolean> => {
  const sessionToken = await AsyncStorage.getItem('gameSessionToken');
  const sessionId = await AsyncStorage.getItem('gameSessionId');
  
  return !!(sessionToken && sessionId);
};

// Clear stored session data
export const clearSession = async (): Promise<void> => {
  try {
    // Clear all session-related data with individual error handling
    const clearPromises = [
      AsyncStorage.removeItem('sessionId'),
      AsyncStorage.removeItem('userData'),
      AsyncStorage.removeItem('lastActivity'),
      AsyncStorage.removeItem('gameSessionToken'),
      AsyncStorage.removeItem('gameSessionId'),
      AsyncStorage.removeItem('currentGameSession'), // GameService session
      AsyncStorage.removeItem('playerName'),
      AsyncStorage.removeItem('mwaAuthToken'), // MWA auth token
      AsyncStorage.removeItem('mwaBase64Address') // MWA wallet address
    ];
    
    // Wait for all clear operations, but don't fail if one fails
    await Promise.allSettled(clearPromises);
    console.log('Session cleared successfully - all auth and game data removed');
  } catch (error) {
    console.log('Error clearing session:', error);
    // Don't throw - we want clearing to be as resilient as possible
  }
};

// Get current session info
export const getCurrentSession = async (): Promise<{ sessionId: string | null; userData: any }> => {
  try {
    const sessionId = await AsyncStorage.getItem('sessionId');
    const userDataStr = await AsyncStorage.getItem('userData');
    
    let userData = null;
    if (userDataStr) {
      try {
        userData = JSON.parse(userDataStr);
      } catch (error) {
        console.log('Failed to parse user data:', error);
      }
    }
    
    return { sessionId, userData };
  } catch (error) {
    console.log('Error getting current session:', error);
    return { sessionId: null, userData: null };
  }
};

// Check if session is valid and extend if needed
export const validateAndExtendSession = async (): Promise<{ isValid: boolean; sessionId?: string }> => {
  
  try {
    const sessionId = await AsyncStorage.getItem('sessionId');
    if (!sessionId) {
      return { isValid: false };
    }

    // First try to validate the current session
    const validateResponse = await fetch(`${config.SERVER_URL}/api/auth/validate`, {
      method: 'GET',
      headers: { 
        'Authorization': `Session ${sessionId}`
      }
    });

    if (validateResponse.ok) {
      const result = await validateResponse.json();
      if (result.success && result.valid) {
        // Extend session expiration since user is active
        await extendSession(sessionId);
        return { isValid: true, sessionId };
      }
    }

    // Session is invalid or expired
    await clearSession();
    return { isValid: false };

  } catch (error) {
    console.log('Session validation/extension error:', error);
    await clearSession();
    return { isValid: false };
  }
};

// Extend session expiration
export const extendSession = async (sessionId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${config.SERVER_URL}/api/auth/extend-session`, {
      method: 'POST',
      headers: { 
        'Authorization': `Session ${sessionId}`
      }
    });

    if (response.ok) {
      const result = await response.json();
      return { success: result.success };
    }

    return { success: false };
  } catch (error) {
    console.log('Session extension error:', error);
    return { success: false };
  }
};

// Update last activity timestamp (for client-side activity tracking)
export const updateLastActivity = async (): Promise<void> => {
  await AsyncStorage.setItem('lastActivity', Date.now().toString());
};

// Check if session has expired due to inactivity (client-side check)
export const isSessionExpired = async (): Promise<boolean> => {
  
  try {
    const lastActivityStr = await AsyncStorage.getItem('lastActivity');
    const sessionId = await AsyncStorage.getItem('sessionId');
    
    // If we have a session but no lastActivity, initialize it now
    if (sessionId && !lastActivityStr) {
      console.log('Session exists but no lastActivity found, initializing timestamp');
      await updateLastActivity();
      return false; // Not expired since we just initialized
    }
    
    if (!lastActivityStr || !sessionId) {
      return true; // No activity recorded and no session, consider expired
    }

    const lastActivity = parseInt(lastActivityStr);
    const now = Date.now();
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours (matching server-side)

    const isExpired = (now - lastActivity) > sessionTimeout;
    if (isExpired) {
      console.log(`Session expired: ${Math.round((now - lastActivity) / 60000)} minutes since last activity`);
    }
    
    return isExpired;
  } catch (error) {
    console.log('Error checking session expiration:', error);
    return true; // On error, consider expired for safety
  }
};

// Save session data after successful authentication
export const saveSessionData = async (sessionId: string, userData: any): Promise<void> => {
  
  try {
    await AsyncStorage.setItem('sessionId', sessionId);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    await updateLastActivity();
    console.log('Session data saved successfully');
  } catch (error) {
    console.log('Failed to save session data:', error);
  }
};