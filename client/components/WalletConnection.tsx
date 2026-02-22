import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Image, Animated, Dimensions, Easing } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config, envLog } from '../config/environment';
import StyledText from './StyledText';
import { validateAndExtendSession, updateLastActivity, isSessionExpired, getCurrentSession, saveSessionData, clearSession } from '../utils/session';
import PolicyConsentModal from './PolicyConsentModal';
import PoliciesModal from './PoliciesModal';
import DialogueOverlay from './DialogueOverlay';
import { getServerPolicyVersions, getAcceptedPolicies, needsNewAcceptance, setAcceptedPolicies, getLocalPolicyVersions, PolicyMeta } from '../utils/policies';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// App identity for Mobile Wallet Adapter
const APP_IDENTITY = {
  name: 'Your App Name',
  uri: 'https://appname.onrender.com',
  icon: './assets/icon.png',
};

interface WalletConnectionProps {
  onAuthChange: (isAuthenticated: boolean, user?: any) => void;
  onUserUpdate?: (updatedUser: User) => void;
  isVisible?: boolean;
}

interface User {
  id: string;
  username: string;
  walletAddress: string;
}

export default function WalletConnection({ onAuthChange, onUserUpdate, isVisible = true }: WalletConnectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showPolicyConsent, setShowPolicyConsent] = useState(false);
  const [policyVersions, setPolicyVersions] = useState<{ terms: PolicyMeta; privacy: PolicyMeta; content: PolicyMeta } | null>(null);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [policiesInitialTab, setPoliciesInitialTab] = useState<'terms' | 'privacy' | 'content'>('terms');
  const [showErrorDialogue, setShowErrorDialogue] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const usernameInputRef = useRef<TextInput>(null);
  
  // Helper function to show error dialogues
  const showError = useCallback((title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorDialogue(true);
  }, []);
  
  // Animation for slide-up container
  const slideAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  // Animation for collapsible wallet info
  const walletInfoAnimation = useRef(new Animated.Value(0)).current; // Start hidden
  // Toggle button slide-in animation
  const toggleButtonSlideAnimation = useRef(new Animated.Value(80)).current; // start off-screen-ish
  const hasAnimatedToggleRef = useRef(false);

  useEffect(() => {
    loadUserFromStorage().finally(() => {
      setIsAuthReady(true);
      // Clear any stale connecting state on app restart
      setIsConnecting(false);
    });
  }, []);

  // Fetch policy versions on mount for consent checks
  useEffect(() => {
    (async () => {
      const remote = await getServerPolicyVersions();
      const versions = remote || getLocalPolicyVersions();
      setPolicyVersions(versions);
    })();
  }, []);

  // Expose refreshUserRank function globally for other components to call
  useEffect(() => {
    if (user) {
      (globalThis as any).refreshUserRank = refreshUserRank;
    } else {
      (globalThis as any).refreshUserRank = null;
    }
    
    return () => {
      (globalThis as any).refreshUserRank = null;
    };
  }, [user]);

  const loadUserFromStorage = async () => {
    try {
      // Check if session has expired due to inactivity
      const expired = await isSessionExpired();
      if (expired) {
        console.log('Session expired due to inactivity, clearing authentication');
        await clearStoredAuth();
        onAuthChange(false);
        return;
      }

      // Validate and extend session if needed
      const sessionResult = await validateAndExtendSession();
      
      if (sessionResult.isValid && sessionResult.sessionId) {
        const { sessionId, userData } = await getCurrentSession();
        if (userData && sessionId) {
          // Ensure wallet info is hidden before setting user to prevent flash
          setShowWalletInfo(false);
          walletInfoAnimation.setValue(0);
          
          setUser(userData);
          setWalletAddress(userData.walletAddress);
          onAuthChange(true, userData);
          
          // Update activity timestamp
          await updateLastActivity();
        }
      } else {
        // Session validation/extension failed, clear stored auth
        console.log('Session validation/extension failed, clearing authentication');
        await clearStoredAuth();
        onAuthChange(false);
      }
    } catch (error) {
      console.log('Error loading user from storage:', error);
      // Clear auth on error to be safe
      await clearStoredAuth();
      onAuthChange(false);
    }
  };

  const clearStoredAuth = async () => {
    await clearSession(); // This clears sessionId, userData, lastActivity, and all game data
    // Ensure we also clear any other auth-related storage
    try {
      await AsyncStorage.multiRemove([
        'sessionId',
        'userData', 
        'lastActivity',
      ]);
    } catch (error) {
      console.log('Error during storage cleanup:', error);
    }
  };

  const toggleWalletInfo = () => {
    const toValue = showWalletInfo ? 0 : 1;
    setShowWalletInfo(!showWalletInfo);
    
    Animated.timing(walletInfoAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    
    try {
      envLog('Starting wallet connection process');
      // Enforce policy consent before attempting wallet auth
      try {
        const versions = policyVersions || getLocalPolicyVersions();
        const accepted = await getAcceptedPolicies();
        if (needsNewAcceptance(versions, accepted)) {
          setShowPolicyConsent(true);
          setIsConnecting(false); // Reset connecting state
          return; // Wait for user consent; they can tap Connect again after accepting
        }
      } catch {}
      
      // Construct Sign-in-with-Solana payload directly
      const signInPayload = {
        domain: config.IS_PRODUCTION ? 'yourserver.onrender.com' : 'localhost',
        statement: 'Sign in to App Name',
        uri: config.IS_PRODUCTION ? 'https://yourserver.onrender.com' : 'http://localhost',
      };
      
      // Add timeout to detect hanging transact calls
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Wallet connection timed out after 60 seconds')), 60000);
      });
      
      const authResult = await Promise.race([
        transact(async (wallet: any) => {
        try {
          // Check for cached MWA auth_token for instant reconnection (following Solana Mobile best practices)
          let cachedAuthToken = await AsyncStorage.getItem('mwaAuthToken');
          
          const authRequest = {
            cluster: (config.IS_PRODUCTION ? 'mainnet-beta' : 'devnet') as any,
            identity: APP_IDENTITY,
            sign_in_payload: signInPayload,
            ...(cachedAuthToken && { auth_token: cachedAuthToken }) // Use cached token to skip approval dialog
          };
          
          const authorizationResult = await wallet.authorize(authRequest);
          return authorizationResult;
        } catch (error: any) {
          envLog('=== ERROR IN TRANSACT CALLBACK ===', { 
            error: error?.message, 
            stack: error?.stack,
            errorType: typeof error
          });
          throw error;
        }
      }).catch((error: any) => {
          envLog('=== TRANSACT PROMISE REJECTED ===', { 
            error: error?.message, 
            stack: error?.stack,
            errorType: typeof error
          });
          throw error;
        }),
        timeoutPromise
      ]);

      if (authResult && authResult.accounts.length > 0) {
        const walletAddr = authResult.accounts[0].address;
        // Step 2: Verify authentication with server using SIWS
        const signInResult = (authResult as any).sign_in_result;
        
        if (!signInResult) {
          throw new Error('No sign-in result from wallet');
        }
        
        const versions = policyVersions || getLocalPolicyVersions();
        const accepted = (await getAcceptedPolicies()) || {
          terms: { version: versions.terms.version, acceptedAt: new Date().toISOString() },
          privacy: { version: versions.privacy.version, acceptedAt: new Date().toISOString() },
          content: { version: versions.content.version, acceptedAt: new Date().toISOString() },
        };

        const verifyPayload = {
          signInInput: signInPayload,
          signInOutput: signInResult,
          acceptedPolicies: accepted
        };

        const verifyResponse = await fetch(`${config.SERVER_URL}/api/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyPayload)
        });

        if (!verifyResponse.ok) {
          const errorText = await verifyResponse.text();
          throw new Error(`Authentication verification failed: ${errorText}`);
        }

        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.success) {
          // Store MWA auth_token and address for future reconnections (following Solana Mobile best practices)
          if (authResult.auth_token) {
            await AsyncStorage.setItem('mwaAuthToken', authResult.auth_token);
            await AsyncStorage.setItem('mwaBase64Address', walletAddr);
          }
          
          if (verifyResult.isNewUser) {
            // New user - show username registration with slide-up animation
            setTempToken(verifyResult.tempToken);
            setWalletAddress(verifyResult.walletAddress);
            setIsRegistering(true);
            setIsConnecting(false);
          } else {
            // Existing user - save session data and login
            await saveSessionData(verifyResult.sessionId, verifyResult.user);
            
            // Ensure wallet info is hidden before setting user to prevent flash
            setShowWalletInfo(false);
            walletInfoAnimation.setValue(0);
            
            setUser(verifyResult.user);
            setWalletAddress(verifyResult.user.walletAddress);
            onAuthChange(true, verifyResult.user);
          }
        } else {
          // If server verification fails, clear MWA token to prevent future lockouts
          await AsyncStorage.removeItem('mwaAuthToken');
          await AsyncStorage.removeItem('mwaBase64Address');
          throw new Error(verifyResult.error || 'Authentication failed');
        }
      } else {
        // Clear MWA token if authorization failed to prevent lockout
        await AsyncStorage.removeItem('mwaAuthToken');
        await AsyncStorage.removeItem('mwaBase64Address');
        throw new Error('No wallet accounts found or authorization failed');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to connect to wallet.';
      
      if (error.message?.includes('No wallet found')) {
        errorMessage = 'No compatible wallet app found. Please install a Solana wallet app like Phantom Mobile.';
      } else if (error.message?.includes('User declined')) {
        errorMessage = 'Connection was cancelled by user.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error dialogue for wallet connection errors
      showError('Connection Failed', errorMessage);
    } finally {
      if (!isRegistering) {
        setIsConnecting(false);
      }
    }
  };

  const registerUsername = async () => {
    if (!username.trim() || !tempToken) return;
    setIsConnecting(true);
    
    try {
      const versions = policyVersions || getLocalPolicyVersions();
      const accepted = (await getAcceptedPolicies()) || {
        terms: { version: versions.terms.version, acceptedAt: new Date().toISOString() },
        privacy: { version: versions.privacy.version, acceptedAt: new Date().toISOString() },
        content: { version: versions.content.version, acceptedAt: new Date().toISOString() },
      };

      const response = await fetch(`${config.SERVER_URL}/api/auth/register-username`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ username: username.trim(), acceptedPolicies: accepted })
      });

      const result = await response.json();
      
      if (result.success) {
        // Save session data and complete registration
        await saveSessionData(result.sessionId, result.user);
        
        // Store MWA auth_token for future reconnections (if we have it from earlier authorization)
        if (walletAddress) {
          const cachedAuthToken = await AsyncStorage.getItem('mwaAuthToken');
          if (!cachedAuthToken) {
            // This shouldn't happen, but let's store the wallet address at least
            await AsyncStorage.setItem('mwaBase64Address', walletAddress);
            envLog('Stored wallet address for new user registration');
          }
        }
        
        // Ensure wallet info is hidden before setting user to prevent flash
        setShowWalletInfo(false);
        walletInfoAnimation.setValue(0);
        
        setUser(result.user);
        setTempToken(null);
        setUsername('');
        
        // Hide the registration modal with animation
        setTimeout(() => {
          setIsRegistering(false);
        }, 300);
        
        onAuthChange(true, result.user);
      } else {
        // Show server error message
        showError('Registration Failed', result.error || 'Username registration failed. Please try again.');
      }
    } catch (error) {
      console.log('Username registration error:', error);
      // Show generic error message
      showError('Registration Failed', 'Failed to register username. Please check your connection and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      try {
        const cachedAuthToken = await AsyncStorage.getItem('mwaAuthToken');
        if (cachedAuthToken) {
          await transact(async (wallet: any) => {
            await wallet.deauthorize({ auth_token: cachedAuthToken });
            envLog('MWA wallet deauthorized successfully');
          });
        }
      } catch (error) {
        console.log('MWA deauthorization failed (non-critical):', error);
      }
      
      try {
        // Logout on server to invalidate session
        const { sessionId } = await getCurrentSession();
        if (sessionId) {
          const logoutResponse = await fetch(`${config.SERVER_URL}/api/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Session ${sessionId}` }
          });
          
          if (logoutResponse.ok) {
            const result = await logoutResponse.json();
            console.log('Server logout successful:', result);
          } else {
            console.log('Server logout failed:', logoutResponse.status);
          }
        }
      } catch (error) {
        console.log('Logout request failed:', error);
      }
      
      // Clear ALL local state and storage
      setUser(null);
      setWalletAddress(null);
      setIsRegistering(false);
      setTempToken(null);
      setUsername('');
      
      try {
        await clearStoredAuth();
      } catch (error) {
        console.log('Failed to clear stored auth:', error);
      }
      
      onAuthChange(false);
      
      console.log('Wallet disconnected successfully');
      // Alert.alert('Disconnected', 'You have been logged out');
    } catch (error) {
      console.log('Error during wallet disconnect:', error);
      // Still try to clear local state even if something fails
      setUser(null);
      setWalletAddress(null);
      onAuthChange(false);
    }
  };

  // Wrapper function to handle async disconnectWallet in event handlers
  const handleDisconnectPress = () => {
    disconnectWallet().catch(error => {
      console.log('Unhandled error in disconnectWallet:', error);
    });
  };

  // Only visible on StartScreen; keep component mounted to preserve state
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      {/* Connect/User Info Section */}
      <View style={styles.walletSection}>
        {user ? (
          <View style={styles.userContainer}>
            {/* Collapsible Wallet Info - appears above toggle */}
            <Animated.View
              style={[
                styles.walletInfo,
                {
                  transform: [
                    {
                      translateY: walletInfoAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [SCREEN_HEIGHT, 0], // Slide in from off-screen bottom
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents={showWalletInfo ? 'auto' : 'none'}
            >
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnectPress}
              >
                <Image
                  source={require('../assets/disconnect.png')}
                  style={styles.disconnectImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
            
            {/* Toggle Button - always visible at bottom */}
            <Animated.View style={{ transform: [{ translateY: toggleButtonSlideAnimation }] }}>
              <TouchableOpacity 
                style={styles.toggleButton}
                onPress={toggleWalletInfo}
                activeOpacity={0.7}
              >
                <StyledText style={styles.toggleButtonText}>
                  {showWalletInfo ? '▲' : '▼'} {user.username}
                </StyledText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (isAuthReady ? (
          <TouchableOpacity
            onPress={connectWallet}
            disabled={isConnecting}
            style={styles.connectButton}
          >
            <Text>
              Connect
            </Text>
          </TouchableOpacity>
        ) : null)}
      </View>

      {/* Animated Slide-up Registration Container */}
      {isRegistering && (
        <Animated.View
          style={[
            styles.slideContainer,
            {
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <View style={styles.container}>
            <StyledText style={styles.title} bold>Create Your Username</StyledText>
            <StyledText style={styles.subtitle}>
              Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </StyledText>
            
            <TextInput
              ref={usernameInputRef}
              style={styles.usernameInput}
              placeholder="Enter username (3-20 characters)"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              blurOnSubmit={false}
              editable={!isConnecting}
              selectTextOnFocus={true}
              onFocus={() => console.log('TextInput focused - isRegistering:', isRegistering, 'isConnecting:', isConnecting)}
              onBlur={() => console.log('TextInput blurred - isRegistering:', isRegistering, 'isConnecting:', isConnecting)}
            />
            
            <TouchableOpacity
              style={[styles.registerButton, !username.trim() && styles.disabledButton]}
              onPress={registerUsername}
              disabled={!username.trim() || isConnecting}
            >
              <StyledText style={styles.registerButtonText} bold>
                {isConnecting ? 'Creating Account...' : 'Create Account'}
              </StyledText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={async () => {
                // Clear MWA auth token to prevent lockout state
                try {
                  await AsyncStorage.removeItem('mwaAuthToken');
                  await AsyncStorage.removeItem('mwaBase64Address');
                  envLog('Cleared MWA auth token due to registration cancellation');
                } catch (error) {
                  console.log('Failed to clear MWA auth token:', error);
                }
                
                setTimeout(() => {
                  setIsRegistering(false);
                  setTempToken(null);
                  setUsername('');
                  setWalletAddress(null);
                  // Reset user state to ensure clean slate
                  setUser(null);
                  onAuthChange(false);
                }, 300);
              }}
            >
              <StyledText style={styles.cancelButtonText}>Cancel</StyledText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <PolicyConsentModal
        visible={showPolicyConsent}
        versions={policyVersions as any}
        onCancel={() => setShowPolicyConsent(false)}
        onViewPolicy={(name) => {
          setPoliciesInitialTab(name as any);
          setShowPoliciesModal(true);
        }}
        onAccept={async (accepted) => {
          await setAcceptedPolicies(accepted);
          setShowPolicyConsent(false);
          // Retry connect
          connectWallet();
        }}
      />
      <PoliciesModal
        visible={showPoliciesModal}
        onClose={() => setShowPoliciesModal(false)}
        initialTab={policiesInitialTab}
      />
      <DialogueOverlay
        visible={showErrorDialogue}
        title={errorTitle}
        message={errorMessage}
        onClose={() => {
          setShowErrorDialogue(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none', // Allow touches to pass through to elements below
  },
  slideContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    padding: 25,
    backgroundColor: 'rgb(177, 233, 255)',
    borderRadius: 25,
    marginHorizontal: 0,
    borderWidth: 3,
    borderColor: 'rgba(117, 147, 246, 0.71)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  }
});