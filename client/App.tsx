import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handleStart = () => {
    Alert.alert('Welcome to Thai Craft!', 'Your Thai language journey begins now. 🚀');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thai Craft</Text>
        <Text style={styles.subtitle}>Your Thai language journey starts here</Text>
        
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start Learning</Text>
        </TouchableOpacity>
        
        <Text style={styles.footer}>Build with @thai_craft_bot</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#999',
  },
});
