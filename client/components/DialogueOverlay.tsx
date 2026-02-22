import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import StyledText from './StyledText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DialogueOverlayProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  closeButtonText?: string;
}

export default function DialogueOverlay({ 
  visible, 
  title, 
  message, 
  onClose, 
  closeButtonText = 'OK' 
}: DialogueOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogueContainer}>
          <View style={styles.dialogueContent}>
            <StyledText style={styles.title} bold>
              {title}
            </StyledText>
            
            <StyledText style={styles.message}>
              {message}
            </StyledText>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <StyledText style={styles.closeButtonText} bold>
                {closeButtonText}
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogueContainer: {
    backgroundColor: 'rgb(177, 233, 255)',
    borderRadius: 25,
    borderWidth: 4,
    borderColor: 'rgba(117, 147, 246, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    maxWidth: SCREEN_WIDTH * 0.85,
    minWidth: SCREEN_WIDTH * 0.7,
  },
  dialogueContent: {
    padding: 25,
    alignItems: 'center',
  },
  title: {
    color: '#FF1493',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Baloo2',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'Baloo2',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 100,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Baloo2',
    textAlign: 'center',
  },
});
