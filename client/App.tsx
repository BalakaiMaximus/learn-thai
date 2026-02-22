import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, Animated, Image, Dimensions, PanResponder } from 'react-native';

// ============ DATA & CONFIGURATION ============

const XP_PER_LEVEL = 500;

const TIERS = [
  { id: 'beginner', name: 'Beginner', minXP: 0, color: '#4CAF50', icon: '🌱', description: 'Tones, alphabet, basic greetings' },
  { id: 'elementary', name: 'Elementary', minXP: 500, color: '#2196F3', icon: '📚', description: 'Common vocabulary, simple sentences' },
  { id: 'pre-intermediate', name: 'Pre-Intermediate', minXP: 1500, color: '#9C27B0', icon: '📖', description: 'Reading Thai script, conversational phrases' },
  { id: 'intermediate', name: 'Intermediate', minXP: 3000, color: '#FF9800', icon: '🎓', description: 'Grammar structures, reading comprehension' },
];

const LESSONS = {
  beginner: [
    { id: 1, title: 'Thai Tones', type: 'tone', xp: 50, duration: '10 min', icon: '🎵', description: 'Learn the 5 Thai tones' },
    { id: 2, title: 'Thai Alphabet', type: 'script', xp: 80, duration: '15 min', icon: 'กขฃ', description: 'Core consonants' },
    { id: 3, title: 'Basic Greetings', type: 'vocab', xp: 30, duration: '5 min', icon: '👋', description: 'Sawasdee & more' },
  ],
  elementary: [
    { id: 4, title: 'Numbers', type: 'vocab', xp: 40, duration: '8 min', icon: '๑๒๓', description: 'Counting 1-100' },
    { id: 5, title: 'Food & Drinks', type: 'vocab', xp: 60, duration: '12 min', icon: '🍜', description: 'Thai cuisine vocabulary' },
    { id: 6, title: 'Simple Sentences', type: 'sentence', xp: 70, duration: '15 min', icon: '✏️', description: 'Build your first sentences' },
  ],
  'pre-intermediate': [
    { id: 7, title: 'Vowels', type: 'script', xp: 80, duration: '15 min', icon: 'ะๅ', description: 'Thai vowel system' },
    { id: 8, title: 'Travel Phrases', type: 'vocab', xp: 60, duration: '10 min', icon: '🚕', description: 'Getting around Thailand' },
    { id: 9, title: 'Shopping', type: 'vocab', xp: 50, duration: '10 min', icon: '🛍️', description: 'Bargaining & prices' },
  ],
  intermediate: [
    { id: 10, title: 'Grammar Basics', type: 'grammar', xp: 100, duration: '20 min', icon: '📝', description: 'Thai sentence structure' },
    { id: 11, title: 'Reading Practice', type: 'reading', xp: 120, duration: '25 min', icon: '📰', description: 'Short Thai texts' },
  ],
};

const THAI_TONES = [
  { thai: 'ทุกข์', romanized: 'thook', english: 'suffering', tone: 'Low', toneColor: '#E91E63', audio: 'low' },
  { thai: 'เสียง', romanized: 'siang', english: 'sound', tone: 'Mid', toneColor: '#2196F3', audio: 'mid' },
  { thai: 'ขาว', romanized: 'khaao', english: 'white', tone: 'High', toneColor: '#9C27B0', audio: 'high' },
  { thai: 'ข่าว', romanized: 'khaao', english: 'news', tone: 'Rising', toneColor: '#FF9800', audio: 'rising' },
  { thai: 'ค่ำ', romanized: 'kham', english: 'evening', tone: 'Falling', toneColor: '#4CAF50', audio: 'falling' },
];

const VOCAB_SETS = {
  greetings: [
    { thai: 'สวัสดี', romanized: 'sawasdee', english: 'Hello/Goodbye', image: '👋' },
    { thai: 'ขอบคุณ', romanized: 'khop khun', english: 'Thank you', image: '🙏' },
    { thai: 'ขอโทษ', romanized: 'kho thot', english: 'Sorry', image: '😔' },
    { thai: 'สบายดีไหม', romanized: 'sabai dee mai', english: 'How are you?', image: '😊' },
    { thai: 'ไม่เป็นไร', romanized: 'mai pen rai', english: "You're welcome", image: '✨' },
  ],
  food: [
    { thai: 'ข้าว', romanized: 'khao', english: 'Rice', image: '🍚' },
    { thai: 'ผัดไทย', romanized: 'pad thai', english: 'Pad Thai', image: '🍜' },
    { thai: 'ต้มยำกุ้ง', romanized: 'tom yum goong', english: 'Spicy soup', image: '🥘' },
    { thai: 'ส้มตำ', romanized: 'som tam', english: 'Papaya salad', image: '🥗' },
    { thai: 'มังสวิรัติ', romanized: 'mang sa wi rat', english: 'Vegetarian', image: '🥬' },
  ],
  numbers: [
    { thai: 'หนึ่ง', romanized: 'neung', english: 'One', image: '1️⃣' },
    { thai: 'สอง', romanized: 'song', english: 'Two', image: '2️⃣' },
    { thai: 'สาม', romanized: 'saam', english: 'Three', image: '3️⃣' },
    { thai: 'สี่', romanized: 'sii', english: 'Four', image: '4️⃣' },
    { thai: 'ห้า', romanized: 'ha', english: 'Five', image: '5️⃣' },
  ],
};

const STREAK_FREEZE_COST = 100;

// Mock leaderboard data
const LEADERBOARD = [
  { rank: 1, name: 'Suda M.', xp: 15420, avatar: '👩‍🦰', tier: 'intermediate' },
  { rank: 2, name: 'Kai T.', xp: 12350, avatar: '👨‍🎓', tier: 'intermediate' },
  { rank: 3, name: 'Nok S.', xp: 9870, avatar: '👩‍🏫', tier: 'pre-intermediate' },
  { rank: 4, name: 'You', xp: 750, avatar: '🤖', tier: 'beginner' },
  { rank: 5, name: 'Pim A.', xp: 620, avatar: '🧑‍💻', tier: 'beginner' },
];

const BADGES = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', earned: true },
  { id: 'streak_7', name: 'Week Warrior', icon: '🔥', earned: true },
  { id: 'words_50', name: 'Word Collector', icon: '📚', earned: true },
  { id: 'tone_master', name: 'Tone Master', icon: '🎵', earned: false },
  { id: 'script_ninja', name: 'Script Ninja', icon: '🥋', earned: false },
  { id: 'streak_30', name: 'Monthly Streak', icon: '⭐', earned: false },
];

// ============ COMPONENTS ============

// Progress Ring Component
const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = '#FF6B35' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  return (
    <View style={{ width: size, height: size }}>
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: size/4, fontWeight: 'bold', color }}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={{ width: size, height: size, borderRadius: size/2, borderWidth: strokeWidth, borderColor: '#E0E0E0', position: 'absolute' }} />
      <View style={{ 
        width: size, 
        height: size, 
        borderRadius: size/2, 
        borderWidth: strokeWidth, 
        borderColor: color, 
        borderRightColor: 'transparent',
        borderBottomColor: progress > 0.25 ? color : 'transparent',
        borderLeftColor: progress > 0.5 ? color : 'transparent',
        borderTopColor: progress > 0.75 ? color : 'transparent',
        transform: [{ rotate: '-45deg' }],
        position: 'absolute' 
      }} />
    </View>
  );
};

// Streak Display Component
const StreakDisplay = ({ streak, freezes }) => {
  return (
    <View style={styles.streakContainer}>
      <View style={styles.streakBadge}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakCount}>{streak}</Text>
      </View>
      <Text style={styles.streakLabel}>day streak</Text>
      <TouchableOpacity style={styles.freezeButton}>
        <Text style={styles.freezeIcon}>❄️</Text>
        <Text style={styles.freezeCount}>{freezes}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Module Card Component
const ModuleCard = ({ title, icon, progress, xp, onPress, color = '#FF6B35' }) => (
  <TouchableOpacity style={styles.moduleCard} onPress={onPress}>
    <View style={[styles.moduleIcon, { backgroundColor: color + '20' }]}>
      <Text style={styles.moduleIconText}>{icon}</Text>
    </View>
    <View style={styles.moduleInfo}>
      <Text style={styles.moduleTitle}>{title}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
    <View style={styles.moduleXP}>
      <Text style={styles.moduleXPText}>+{xp} XP</Text>
    </View>
  </TouchableOpacity>
);

// Lesson Card Component
const LessonCard = ({ lesson, onPress }) => {
  const tier = TIERS.find(t => t.id === lesson.type) || TIERS[0];
  return (
    <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
      <View style={[styles.lessonBadge, { backgroundColor: tier.color }]}>
        <Text style={styles.lessonBadgeText}>{tier.name}</Text>
      </View>
      <Text style={styles.lessonIcon}>{lesson.icon}</Text>
      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.lessonDesc}>{lesson.description}</Text>
      <View style={styles.lessonMeta}>
        <Text style={styles.lessonXP}>+{lesson.xp} XP</Text>
        <Text style={styles.lessonDuration}>⏱ {lesson.duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Quick Lesson Button
const QuickLessonBtn = ({ onPress }) => (
  <TouchableOpacity style={styles.quickLessonBtn} onPress={onPress}>
    <Text style={styles.quickLessonIcon}>⚡</Text>
    <View style={styles.quickLessonText}>
      <Text style={styles.quickLessonTitle}>Quick 5-min Lesson</Text>
      <Text style={styles.quickLessonSubtitle}>Perfect for your break!</Text>
    </View>
    <Text style={styles.quickLessonArrow}>→</Text>
  </TouchableOpacity>
);

// Leaderboard Item
const LeaderboardItem = ({ item }) => (
  <View style={[styles.leaderboardItem, item.name === 'You' && styles.leaderboardItemYou]}>
    <Text style={styles.leaderboardRank}>#{item.rank}</Text>
    <Text style={styles.leaderboardAvatar}>{item.avatar}</Text>
    <Text style={styles.leaderboardName}>{item.name}</Text>
    <Text style={styles.leaderboardXP}>{item.xp.toLocaleString()} XP</Text>
  </View>
);

// Badge Component
const BadgeItem = ({ badge }) => (
  <View style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
    <Text style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>{badge.icon}</Text>
    <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>{badge.name}</Text>
  </View>
);

// Milestone Banner
const MilestoneBanner = ({ message, visible }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <Animated.View style={[styles.milestoneBanner, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.milestoneIcon}>🎉</Text>
      <Text style={styles.milestoneText}>{message}</Text>
    </Animated.View>
  );
};

// ============ SCREENS ============

// Home Screen
const HomeScreen = ({ userXP, streak, freezes, onNavigate }) => {
  const currentTier = TIERS.find(t => userXP >= t.minXP) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const tierProgress = nextTier ? (userXP - currentTier.minXP) / (nextTier.minXP - currentTier.minXP) : 1;
  
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.tierBadge}>{currentTier.icon} {currentTier.name}</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      
      {/* XP Progress */}
      <View style={styles.xpCard}>
        <View style={styles.xpInfo}>
          <Text style={styles.xpLabel}>Total XP</Text>
          <Text style={styles.xpValue}>{userXP.toLocaleString()}</Text>
        </View>
        <View style={styles.xpProgress}>
          <View style={styles.xpProgressBar}>
            <View style={[styles.xpProgressFill, { width: `${tierProgress * 100}%` }]} />
          </View>
          {nextTier && (
            <Text style={styles.xpNextTier}>Next: {nextTier.name} at {nextTier.minXP} XP</Text>
          )}
        </View>
      </View>
      
      {/* Streak & Quick Lesson */}
      <View style={styles.homeRow}>
        <StreakDisplay streak={streak} freezes={freezes} />
        <QuickLessonBtn onPress={() => onNavigate('lessons')} />
      </View>
      
      {/* Continue Learning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <ModuleCard 
          title="Tone Training" 
          icon="🎵" 
          progress={0.6} 
          xp={50}
          color="#E91E63"
          onPress={() => {}}
        />
        <ModuleCard 
          title="Vocabulary Builder" 
          icon="📚" 
          progress={0.3} 
          xp={60}
          color="#2196F3"
          onPress={() => {}}
        />
      </View>
      
      {/* Milestone */}
      <MilestoneBanner message="🎉 You've learned 50 words!" visible={true} />
    </ScrollView>
  );
};

// Lessons Screen
const LessonsScreen = ({ onNavigate }) => {
  const [activeTier, setActiveTier] = useState('beginner');
  
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Lessons</Text>
      
      {/* Tier Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tierTabs}>
        {TIERS.map(tier => (
          <TouchableOpacity 
            key={tier.id} 
            style={[styles.tierTab, activeTier === tier.id && { backgroundColor: tier.color }]}
            onPress={() => setActiveTier(tier.id)}
          >
            <Text style={[styles.tierTabIcon]}>{tier.icon}</Text>
            <Text style={[styles.tierTabName, activeTier === tier.id && styles.tierTabNameActive]}>
              {tier.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Lesson List */}
      <ScrollView style={styles.lessonList} showsVerticalScrollIndicator={false}>
        <Text style={styles.tierDesc}>{TIERS.find(t => t.id === activeTier)?.description}</Text>
        {(LESSONS[activeTier] || []).map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
};

// Practice Screen
const PracticeScreen = () => {
  const [practiceMode, setPracticeMode] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  const currentVocab = VOCAB_SETS.greetings;
  
  const handleAnswer = (correct) => {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setShowAnswer(false);
    setCurrentCard(c => (c + 1) % currentVocab.length);
  };
  
  if (!practiceMode) {
    return (
      <View style={styles.screen}>
        <Text style={styles.screenTitle}>Practice</Text>
        <Text style={styles.screenSubtitle}>Choose a practice mode</Text>
        
        <View style={styles.practiceModes}>
          <TouchableOpacity style={styles.practiceModeCard} onPress={() => setPracticeMode('flashcards')}>
            <Text style={styles.practiceModeIcon}>🃏</Text>
            <Text style={styles.practiceModeTitle}>Flashcards</Text>
            <Text style={styles.practiceModeDesc}>SRS-powered recall</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.practiceModeCard} onPress={() => setPracticeMode('tones')}>
            <Text style={styles.practiceModeIcon}>🎵</Text>
            <Text style={styles.practiceModeTitle}>Tone Drill</Text>
            <Text style={styles.practiceModeDesc}>Master Thai tones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.practiceModeCard} onPress={() => setPracticeMode('matching')}>
            <Text style={styles.practiceModeIcon}>🔗</Text>
            <Text style={styles.practiceModeTitle}>Matching</Text>
            <Text style={styles.practiceModeDesc}>Word associations</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (practiceMode === 'flashcards') {
    const card = currentVocab[currentCard];
    return (
      <View style={styles.screen}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setPracticeMode(null)}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>Flashcards</Text>
        
        <View style={styles.flashcardContainer}>
          <TouchableOpacity 
            style={styles.flashcard} 
            onPress={() => setShowAnswer(!showAnswer)}
            activeOpacity={0.9}
          >
            <Text style={styles.flashcardEmoji}>{card.image}</Text>
            <Text style={styles.flashcardThai}>{card.thai}</Text>
            {showAnswer && (
              <>
                <Text style={styles.flashcardRomanized}>{card.romanized}</Text>
                <Text style={styles.flashcardEnglish}>{card.english}</Text>
              </>
            )}
            {!showAnswer && <Text style={styles.flashcardTap}>Tap to reveal</Text>}
          </TouchableOpacity>
        </View>
        
        {showAnswer && (
          <View style={styles.flashcardActions}>
            <TouchableOpacity 
              style={[styles.flashcardBtn, styles.flashcardBtnWrong]}
              onPress={() => handleAnswer(false)}
            >
              <Text style={styles.flashcardBtnText}>✗ Need practice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.flashcardBtn, styles.flashcardBtnCorrect]}
              onPress={() => handleAnswer(true)}
            >
              <Text style={styles.flashcardBtnText}>✓ Got it!</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.scoreText}>Score: {score.correct}/{score.total}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setPracticeMode(null)}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Coming Soon</Text>
    </View>
  );
};

// Progress Screen
const ProgressScreen = ({ userXP, streak }) => {
  const currentTier = TIERS.find(t => userXP >= t.minXP && (!TIERS[TIERS.indexOf(t) + 1] || userXP < TIERS[TIERS.indexOf(t) + 1].minXP)) || TIERS[0];
  const wordsLearned = 57;
  const lessonsCompleted = 8;
  
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Your Progress</Text>
      
      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{wordsLearned}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lessonsCompleted}</Text>
          <Text style={styles.statLabel}>Lessons Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userXP}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
      </View>
      
      {/* Current Tier */}
      <View style={[styles.tierProgressCard, { borderColor: currentTier.color }]}>
        <Text style={styles.tierProgressIcon}>{currentTier.icon}</Text>
        <View style={styles.tierProgressInfo}>
          <Text style={styles.tierProgressName}>{currentTier.name} Level</Text>
          <Text style={styles.tierProgressDesc}>{currentTier.description}</Text>
        </View>
      </View>
      
      {/* Badges */}
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgeGrid}>
        {BADGES.map(badge => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </View>
      
      {/* Leaderboard */}
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      <View style={styles.leaderboard}>
        {LEADERBOARD.map(item => (
          <LeaderboardItem key={item.rank} item={item} />
        ))}
      </View>
    </ScrollView>
  );
};

// Profile Screen
const ProfileScreen = ({ userXP, streak, freezes, onUpdateFreezes }) => {
  const currentTier = TIERS.find(t => userXP >= t.minXP && (!TIERS[TIERS.indexOf(t) + 1] || userXP < TIERS[TIERS.indexOf(t) + 1].minXP)) || TIERS[0];
  
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Profile</Text>
      
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={[styles.profileAvatar, { borderColor: currentTier.color }]}>
          <Text style={styles.profileAvatarText}>🤖</Text>
        </View>
        <Text style={styles.profileName}>Thai Learner</Text>
        <View style={[styles.profileTier, { backgroundColor: currentTier.color }]}>
          <Text style={styles.profileTierText}>{currentTier.icon} {currentTier.name}</Text>
        </View>
      </View>
      
      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🔔</Text>
          <Text style={styles.settingsLabel}>Notifications</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🌙</Text>
          <Text style={styles.settingsLabel}>Daily Reminder</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🔒</Text>
          <Text style={styles.settingsLabel}>Privacy</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Streak Freeze</Text>
        <View style={styles.freezeShop}>
          <View style={styles.freezeInfo}>
            <Text style={styles.freezeShopIcon}>❄️</Text>
            <View>
              <Text style={styles.freezeShopTitle}>Streak Freeze</Text>
              <Text style={styles.freezeShopDesc}>Protect your streak for a day!</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.freezeBuyBtn, freezes < 1 && styles.freezeBuyBtnDisabled]}
            onPress={() => freezes > 0 && onUpdateFreezes(freezes - 1)}
          >
            <Text style={styles.freezeBuyText}>Use (have: {freezes})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// ============ MAIN APP ============

type Tab = 'home' | 'lessons' | 'practice' | 'progress' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [userXP, setUserXP] = useState(750);
  const [streak, setStreak] = useState(7);
  const [freezes, setFreezes] = useState(2);
  
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'lessons', icon: '📖', label: 'Lessons' },
    { id: 'practice', icon: '✏️', label: 'Practice' },
    { id: 'progress', icon: '📊', label: 'Progress' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];
  
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen userXP={userXP} streak={streak} freezes={freezes} onNavigate={setActiveTab} />;
      case 'lessons':
        return <LessonsScreen onNavigate={setActiveTab} />;
      case 'practice':
        return <PracticeScreen />;
      case 'progress':
        return <ProgressScreen userXP={userXP} streak={streak} />;
      case 'profile':
        return <ProfileScreen userXP={userXP} streak={streak} freezes={freezes} onUpdateFreezes={setFreezes} />;
      default:
        return <HomeScreen userXP={userXP} streak={streak} freezes={freezes} onNavigate={setActiveTab} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.navItem, activeTab === tab.id && styles.navItemActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.navIcon, activeTab === tab.id && styles.navIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8F0',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  
  // Home Screen
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  tierBadge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  
  // XP Card
  xpCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  xpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpLabel: {
    fontSize: 14,
    color: '#666',
  },
  xpValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  xpProgress: {},
  xpProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  xpNextTier: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  
  // Home Row
  homeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  
  // Streak
  streakContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
  freezeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  freezeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  freezeCount: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  
  // Quick Lesson
  quickLessonBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quickLessonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  quickLessonText: {
    flex: 1,
  },
  quickLessonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  quickLessonSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  quickLessonArrow: {
    fontSize: 20,
    color: 'white',
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  
  // Module Card
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleIconText: {
    fontSize: 24,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  moduleXP: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moduleXPText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  
  // Milestone Banner
  milestoneBanner: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  milestoneIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  milestoneText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  // Lessons Screen
  tierTabs: {
    marginBottom: 16,
  },
  tierTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
  },
  tierTabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tierTabName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tierTabNameActive: {
    color: 'white',
  },
  tierDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  lessonList: {
    flex: 1,
  },
  lessonCard: {
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
  lessonBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  lessonBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  lessonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  lessonDuration: {
    fontSize: 14,
    color: '#999',
  },
  
  // Practice Screen
  practiceModes: {
    gap: 12,
  },
  practiceModeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceModeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  practiceModeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  practiceModeDesc: {
    fontSize: 14,
    color: '#999',
  },
  
  // Flashcard
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  flashcardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcard: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  flashcardEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  flashcardThai: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  flashcardRomanized: {
    fontSize: 24,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
  },
  flashcardEnglish: {
    fontSize: 20,
    color: '#666',
  },
  flashcardTap: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  flashcardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  flashcardBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  flashcardBtnWrong: {
    backgroundColor: '#FFEBEE',
  },
  flashcardBtnCorrect: {
    backgroundColor: '#E8F5E9',
  },
  flashcardBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  
  // Progress Screen
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tierProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tierProgressIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  tierProgressInfo: {
    flex: 1,
  },
  tierProgressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tierProgressDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  
  // Badges
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  badgeItem: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeItemLocked: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#999',
  },
  
  // Leaderboard
  leaderboard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leaderboardItemYou: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  leaderboardRank: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  leaderboardAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  leaderboardXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  
  // Profile Screen
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileTier: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  profileTierText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  // Settings
  settingsSection: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  settingsArrow: {
    fontSize: 20,
    color: '#999',
  },
  
  // Freeze Shop
  freezeShop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  freezeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freezeShopIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  freezeShopTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  freezeShopDesc: {
    fontSize: 12,
    color: '#666',
  },
  freezeBuyBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  freezeBuyBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  freezeBuyText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  // Navigation
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#FFF3E0',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIconActive: {},
  navLabel: {
    fontSize: 10,
    color: '#999',
  },
  navLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
});
