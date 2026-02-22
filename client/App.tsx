import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

// Thai consonants sample data
const THAI_CONSONANTS = [
  { thai: 'ก', romanized: 'gor gai', meaning: 'chicken' },
  { thai: 'ข', romanized: 'khor khai', meaning: 'egg' },
  { thai: 'ค', romanized: 'khor khwai', meaning: 'buffalo' },
  { thai: 'ง', romanized: 'ngor ngu', meaning: 'snake' },
  { thai: 'จ', romanized: 'jor jaan', meaning: 'plate' },
  { thai: 'ฉ', romanized: 'chor ching', meaning: 'cymbals' },
];

// Common phrases
const PHRASES = [
  { thai: 'สวัสดี', romanized: 'sawasdee', meaning: 'hello/goodbye' },
  { thai: 'ขอบคุณ', romanized: 'khop khun', meaning: 'thank you' },
  { thai: 'ใช่', romanized: 'chai', meaning: 'yes' },
  { thai: 'ไม่ใช่', romanized: 'mai chai', meaning: 'no' },
];

type Tab = 'alphabet' | 'phrases' | 'practice';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('alphabet');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const renderAlphabet = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Thai Consonants</Text>
      <View style={styles.cardGrid}>
        {THAI_CONSONANTS.map((char, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, selectedCard === index && styles.cardSelected]}
            onPress={() => setSelectedCard(selectedCard === index ? null : index)}
          >
            <Text style={styles.thaiChar}>{char.thai}</Text>
            {selectedCard === index && (
              <View style={styles.cardDetails}>
                <Text style={styles.romanized}>{char.romanized}</Text>
                <Text style={styles.meaning}>{char.meaning}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderPhrases = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Common Phrases</Text>
      {PHRASES.map((phrase, index) => (
        <TouchableOpacity key={index} style={styles.phraseCard}>
          <View style={styles.phraseMain}>
            <Text style={styles.phraseThai}>{phrase.thai}</Text>
            <Text style={styles.phraseRomanized}>{phrase.romanized}</Text>
          </View>
          <Text style={styles.phraseMeaning}>{phrase.meaning}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPractice = () => (
    <View style={styles.practiceContainer}>
      <Text style={styles.sectionTitle}>Practice Mode</Text>
      <View style={styles.practiceCard}>
        <Text style={styles.practiceQuestion}>What does this mean?</Text>
        <Text style={styles.practiceThai}>สวัสดี</Text>
        <View style={styles.answerOptions}>
          {['hello', 'thank you', 'goodbye', 'please'].map((option, i) => (
            <TouchableOpacity key={i} style={styles.answerButton}>
              <Text style={styles.answerText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Learn Thai 🙏</Text>
        <Text style={styles.tagline}>Master the language of smiles</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {activeTab === 'alphabet' && renderAlphabet()}
        {activeTab === 'phrases' && renderPhrases()}
        {activeTab === 'practice' && renderPractice()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'alphabet' && styles.navItemActive]}
          onPress={() => setActiveTab('alphabet')}
        >
          <Text style={[styles.navIcon, activeTab === 'alphabet' && styles.navIconActive]}>ก</Text>
          <Text style={[styles.navLabel, activeTab === 'alphabet' && styles.navLabelActive]}>Alphabet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'phrases' && styles.navItemActive]}
          onPress={() => setActiveTab('phrases')}
        >
          <Text style={[styles.navIcon, activeTab === 'phrases' && styles.navIconActive]}>💬</Text>
          <Text style={[styles.navLabel, activeTab === 'phrases' && styles.navLabelActive]}>Phrases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'practice' && styles.navItemActive]}
          onPress={() => setActiveTab('practice')}
        >
          <Text style={[styles.navIcon, activeTab === 'practice' && styles.navIconActive]}>✏️</Text>
          <Text style={[styles.navLabel, activeTab === 'practice' && styles.navLabelActive]}>Practice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
  },
  cardSelected: {
    backgroundColor: '#FF6B35',
  },
  thaiChar: {
    fontSize: 36,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  cardDetails: {
    alignItems: 'center',
    marginTop: 4,
  },
  romanized: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  meaning: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
  },
  phraseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phraseMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phraseThai: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  phraseRomanized: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  phraseMeaning: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  practiceContainer: {
    flex: 1,
  },
  practiceCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  practiceQuestion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  practiceThai: {
    fontSize: 48,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  answerOptions: {
    width: '100%',
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFE4D6',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIconActive: {
    color: '#FF6B35',
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
  },
  navLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
});