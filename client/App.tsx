import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';

export default function App() {
  const [showChoices, setShowChoices] = useState(false);

  const handleStart = () => {
    setShowChoices(true);
  };

  const handleChoice = (choice) => {
    Alert.alert(`You chose: ${choice}!`, `Starting ${choice} mode... ⛏️`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.sky} />
      <View style={styles.clouds}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={styles.cloud}>☁️</Text>
      </View>
      
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>THAI CRAFT</Text>
        </View>
        
        <Text style={styles.subtitle}>Craft your Thai skills one block at a time!</Text>
        
        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>▶ START</Text>
        </TouchableOpacity>
        
        {/* Blocks */}
        <View style={styles.blocks}>
          <Text style={styles.block}>🪵</Text>
          <Text style={styles.block}>🧱</Text>
          <Text style={styles.block}>🌲</Text>
          <Text style={styles.block}>⛏️</Text>
        </View>
        
        <Text style={styles.footer}>Build with @thai_craft_bot</Text>
      </View>
      
      {/* Ground */}
      <View style={styles.ground}>
        <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
      </View>

      {/* Choice Modal */}
      <Modal
        visible={showChoices}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChoices(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Path ⛏️</Text>
            
            <TouchableOpacity 
              style={styles.choiceButton} 
              onPress={() => handleChoice('Word Quest')}
            >
              <Text style={styles.choiceIcon}>😊</Text>
              <Text style={styles.choiceTitle}>Word Quest</Text>
              <Text style={styles.choiceDesc}>Learn by reading daily words</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.choiceButton, styles.choiceButtonPlay]} 
              onPress={() => handleChoice('Study Mode')}
            >
              <Text style={styles.choiceIcon}>📚</Text>
              <Text style={styles.choiceTitle}>Study Mode</Text>
              <Text style={styles.choiceDesc}>Learn Thai Letters & Rules</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowChoices(false)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
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
    color: '#55FF55',
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
    backgroundColor: '#7C7C7C',
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
    backgroundColor: '#5D4037',
    borderTopWidth: 6,
    borderTopColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groundTexture: {
    fontSize: 12,
    color: '#4CAF50',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 24,
    borderWidth: 4,
    borderColor: '#3d3d3d',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55FF55',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Courier',
  },
  choiceButton: {
    backgroundColor: '#3d3d3d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#555',
  },
  choiceButtonPlay: {
    borderColor: '#555',
  },
  choiceIcon: {
    fontSize: 32,
    marginRight: 24,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    letterSpacing: 2,
    marginBottom: 14,
  },
  choiceDesc: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 1,
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#999',
    fontSize: 14,
  },
});
