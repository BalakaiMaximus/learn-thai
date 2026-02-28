import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'wordquest', 'studymode', 'practice', 'both'

  const handleStart = () => {
    setCurrentPage('choices');
  };

  const handleChoice = (choice) => {
    if (choice === 'Word Quest') {
      setCurrentPage('wordquest');
    } else if (choice === 'Study Mode') {
      setCurrentPage('studymode');
    } else if (choice === 'Practice') {
      setCurrentPage('practice');
    } else if (choice === 'Both') {
      setCurrentPage('both');
    }
  };

  const goHome = () => {
    setCurrentPage('home');
  };

  const goBack = () => {
    setCurrentPage('choices');
  };

  // ============ WORD QUEST PAGE ============
  if (currentPage === 'wordquest') {
    const words = [
      { thai: 'ข้าว', roman: 'Khao', meaning: 'Rice' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>📖 Word Quest</Text>
          <View style={{ width: 60 }} />
        </View>
        
        <ScrollView style={styles.wordList}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordCard}>
              <Text style={styles.wordThai}>{word.thai}</Text>
              <Text style={styles.wordRoman}>{word.roman}</Text>
              <Text style={styles.wordMeaning}>{word.meaning}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.ground}>
          <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============ STUDY MODE PAGE ============
  if (currentPage === 'studymode') {
    const consonants = [
      { letter: 'ก', name: 'Ko Kai', sound: 'G' },
      { letter: 'ข', name: 'Kho Khai', sound: 'K' },
      { letter: 'ฃ', name: 'Kho Khuat', sound: 'K' },
      { letter: 'ค', name: 'Kho Kong', sound: 'K' },
      { letter: 'ฅ', name: 'Kho Son', sound: 'K' },
      { letter: 'ฆ', name: 'Kho Rai', sound: 'K' },
      { letter: 'ง', name: 'Ngo Ngu', sound: 'NG' },
      { letter: 'จ', name: 'Cho Chan', sound: 'J' },
      { letter: 'ฉ', name: 'Cho Ching', sound: 'CH' },
      { letter: 'ช', name: 'Cho Chang', sound: 'CH' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>📚 Study Mode</Text>
          <View style={{ width: 60 }} />
        </View>
        
        <ScrollView style={styles.wordList}>
          <Text style={styles.sectionTitle}>Thai Consonants (Class 1)</Text>
          {consonants.map((item, index) => (
            <View key={index} style={styles.studyCard}>
              <Text style={styles.studyLetter}>{item.letter}</Text>
              <View style={styles.studyInfo}>
                <Text style={styles.studyName}>{item.name}</Text>
                <Text style={styles.studySound}>Sound: /{item.sound}/</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.ground}>
          <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============ PRACTICE PAGE (BOTH) ============
  if (currentPage === 'practice') {
    const words = [
      { thai: 'สวัสดี', roman: 'Sawasdee', meaning: 'Hello' },
      { thai: 'ขอบคุณ', roman: 'Khob Khun', meaning: 'Thank you' },
      { thai: 'สบายดี', roman: 'Sabai Dee', meaning: 'Good/Well' },
      { thai: 'หิว', roman: 'Hio', meaning: 'Hungry' },
      { thai: 'เหนื่อย', roman: 'Neuy', meaning: 'Tired' },
    ];

    const consonants = [
      { letter: 'ก', name: 'Ko Kai', sound: 'G' },
      { letter: 'ข', name: 'Kho Khai', sound: 'K' },
      { letter: 'ค', name: 'Kho Kong', sound: 'K' },
      { letter: 'ง', name: 'Ngo Ngu', sound: 'NG' },
      { letter: 'จ', name: 'Cho Chan', sound: 'J' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>🎯 Practice Mode</Text>
          <View style={{ width: 60 }} />
        </View>
        
        <ScrollView style={styles.wordList}>
          <Text style={styles.sectionTitle}>📖 Word Quest Review</Text>
          {words.map((word, index) => (
            <View key={`word-${index}`} style={styles.wordCard}>
              <Text style={styles.wordThai}>{word.thai}</Text>
              <Text style={styles.wordRoman}>{word.roman}</Text>
              <Text style={styles.wordMeaning}>{word.meaning}</Text>
            </View>
          ))}
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>📚 Consonants Review</Text>
          {consonants.map((item, index) => (
            <View key={`cons-${index}`} style={styles.studyCard}>
              <Text style={styles.studyLetter}>{item.letter}</Text>
              <View style={styles.studyInfo}>
                <Text style={styles.studyName}>{item.name}</Text>
                <Text style={styles.studySound}>Sound: /{item.sound}/</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.ground}>
          <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============ BOTH PAGE ============
  if (currentPage === 'both') {
    const words = [
      { thai: 'สวัสดี', roman: 'Sawasdee', meaning: 'Hello' },
      { thai: 'ขอบคุณ', roman: 'Khob Khun', meaning: 'Thank you' },
      { thai: 'สบายดี', roman: 'Sabai Dee', meaning: 'Good/Well' },
      { thai: 'หิว', roman: 'Hio', meaning: 'Hungry' },
      { thai: 'เหนื่อย', roman: 'Neuy', meaning: 'Tired' },
      { thai: 'มา', roman: 'Maa', meaning: 'Come' },
      { thai: 'ไป', roman: 'Pai', meaning: 'Go' },
      { thai: 'กิน', roman: 'Gin', meaning: 'Eat' },
      { thai: 'ดื่ม', roman: 'Deum', meaning: 'Drink' },
      { thai: 'นอน', roman: 'Non', meaning: 'Sleep' },
    ];

    const consonants = [
      { letter: 'ก', name: 'Ko Kai', sound: 'G' },
      { letter: 'ข', name: 'Kho Khai', sound: 'K' },
      { letter: 'ฃ', name: 'Kho Khuat', sound: 'K' },
      { letter: 'ค', name: 'Kho Kong', sound: 'K' },
      { letter: 'ฅ', name: 'Kho Son', sound: 'K' },
      { letter: 'ฆ', name: 'Kho Rai', sound: 'K' },
      { letter: 'ง', name: 'Ngo Ngu', sound: 'NG' },
      { letter: 'จ', name: 'Cho Chan', sound: 'J' },
      { letter: 'ฉ', name: 'Cho Ching', sound: 'CH' },
      { letter: 'ช', name: 'Cho Chang', sound: 'CH' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>🤝 Both Modes</Text>
          <View style={{ width: 60 }} />
        </View>
        
        <ScrollView style={styles.wordList}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, minWidth: 300, marginRight: 16 }}>
              <Text style={styles.sectionTitle}>📖 Word Quest</Text>
              {words.map((word, index) => (
                <View key={`word-${index}`} style={styles.wordCard}>
                  <Text style={styles.wordThai}>{word.thai}</Text>
                  <Text style={styles.wordRoman}>{word.roman}</Text>
                  <Text style={styles.wordMeaning}>{word.meaning}</Text>
                </View>
              ))}
            </View>
            
            <View style={{ flex: 1, minWidth: 300 }}>
              <Text style={styles.sectionTitle}>📚 Study Mode</Text>
              {consonants.map((item, index) => (
                <View key={`cons-${index}`} style={styles.studyCard}>
                  <Text style={styles.studyLetter}>{item.letter}</Text>
                  <View style={styles.studyInfo}>
                    <Text style={styles.studyName}>{item.name}</Text>
                    <Text style={styles.studySound}>Sound: /{item.sound}/</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.ground}>
          <Text style={styles.groundTexture}>🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛🟫⬛🌱⬛</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============ HOME PAGE ============
  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.sky} />
      <View style={styles.clouds}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudSmall]}>☁️</Text>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudLarge]}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudSmall]}>☁️</Text>
      </View>
      
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>THAI CRAFT</Text>
        </View>
        
        <Text style={styles.subtitle}>Aint no way!</Text>
        
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
      {currentPage === 'choices' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Path ⛏️</Text>
            
            <TouchableOpacity 
              style={styles.choiceButton} 
              onPress={() => handleChoice('Word Quest')}
            >
              <Text style={styles.choiceIcon}>😊</Text>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceTitle}>Word Quest</Text>
                <Text style={styles.choiceDesc}>Learn by reading daily words</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.choiceButton} 
              onPress={() => handleChoice('Study Mode')}
            >
              <Text style={styles.choiceIcon}>📚</Text>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceTitle}>Study Mode</Text>
                <Text style={styles.choiceDesc}>Learn Thai Letters & Rules</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.choiceButton, styles.choiceButtonPlay]} 
              onPress={() => handleChoice('Practice')}
            >
              <Text style={styles.choiceIcon}>🎯</Text>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceTitle}>Practice</Text>
                <Text style={styles.choiceDesc}>Review Words & Letters</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.choiceButton, styles.choiceButtonBoth]} 
              onPress={() => handleChoice('Both')}
            >
              <Text style={styles.choiceIcon}>🤝</Text>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceTitle}>Both</Text>
                <Text style={styles.choiceDesc}>Word Quest & Study Mode side by side</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={goHome}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000FF', /* New */
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
  cloudSmall: {
    fontSize: 28,
    marginTop: 15,
  },
  cloudLarge: {
    fontSize: 52,
    marginTop: -10,
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
    backgroundColor: '#3B82F6',
    borderWidth: 4,
    borderColor: '#2563EB',
    borderBottomColor: '#1D4ED8',
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
    fontSize: 1al: '555',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    borderColor: '#00FF00',
  },
  choiceButtonBoth: {
    borderColor: '#FFA500',
  },
  choiceIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  choiceDesc: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 1,
    marginTop: 4,
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

  // Page Header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 4,
    borderBottomColor: '#3d3d3d',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#55FF55',
    fontSize: 16,
    fontFamily: 'Courier',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#55FF55',
    fontFamily: 'Courier',
  },

  // Word List
  wordList: {
    flex: 1,
    padding: 16,
  },
  wordCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#3d3d3d',
  },
  wordThai: {
    fontSize: 32,
    color: '#55FF55',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  wordRoman: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  wordMeaning: {
    fontSize: 14,
    color: '#999',
  },

  // Study Mode
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    marginTop: 8,
  },
  studyCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3d3d3d',
  },
  studyLetter: {
    fontSize: 48,
    color: '#FFD700',
    fontWeight: 'bold',
    width: 80,
  },
  studyInfo: {
    flex: 1,
  },
  studyName: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  studySound: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
