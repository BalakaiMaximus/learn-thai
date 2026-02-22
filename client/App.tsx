import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handleStart = () => {
    Alert.alert('⚔️ Welcome to Thai Craft!', 'Your Thai language adventure begins now. Let\'s craft some words! ⛏️');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background texture layers */}
      <View style={styles.sky} />
      <View style={styles.clouds}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={styles.cloud}>☁️</Text>
      </View>
      
      <View style={styles.content}>
        {/* Pixelated Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>THAI CRAFT</Text>
        </View>
        
        <Text style={styles.subtitle}>Craft your Thai skills one block at a time!</Text>
        
        {/* Minecraft-style Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>▶ START</Text>
        </TouchableOpacity>
        
        {/* Decorative blocks */}
        <View style={styles.blocks}>
          <Text style={styles.block}>🪵</Text>
          <Text style={styles.block}>🧱</Text>
          <Text style={styles.block}>🌲</Text>
          <Text style={styles.block}>⛏️</Text>
        </View>
        
        <Text style={styles.footer}>Build with @thai_craft_bot</Text>
      </View>
      
      {/* Grass ground */}
      <View style={styles.ground}>
        <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#87CEEB',
  },
  clouds: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  cloud: {
    fontSize: 40,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 4,
    borderColor: '#3d3d3d',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#55FF55', // Minecraft green
    fontFamily: 'Courier',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#2d2d2d',
    marginBottom: 40,
    fontFamily: 'Courier',
  },
  startButton: {
    backgroundColor: '#7C7C7C', // Minecraft button gray
    borderWidth: 4,
    borderColor: '#3d3d3d',
    borderBottomColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  blocks: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  block: {
    fontSize: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    fontSize: 10,
    color: '#555',
    fontFamily: 'Courier',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#5D4037', // Dirt brown
    borderTopWidth: 6,
    borderTopColor: '#4CAF50', // Grass green
    justifyContent: 'center',
    alignItems: 'center',
  },
  groundTexture: {
    fontSize: 12,
    color: '#4CAF50',
  },
});
