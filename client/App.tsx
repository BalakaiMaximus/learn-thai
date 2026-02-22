import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Simulate some loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  const handleSwapPress = () => {
    Alert.alert('Swap', 'Swap functionality coming soon!');
  };

  const handleConnectWallet = () => {
    Alert.alert('Wallet', 'Connect wallet functionality coming soon!');
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your App!</Text>
        <Text style={styles.subtitle}>Your decentralized trading platform</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.swapButton]} onPress={handleSwapPress}>
            <Text style={styles.buttonText}>Swap Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.connectButton]} onPress={handleConnectWallet}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Solana</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  swapButton: {
    backgroundColor: '#4F46E5',
  },
  connectButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});