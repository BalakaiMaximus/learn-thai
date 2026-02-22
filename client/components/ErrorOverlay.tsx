import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp?: number;
  errorBoundary?: boolean;
  context?: string;
}

interface ErrorOverlayProps {
  visible: boolean;
  error: ErrorInfo | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  onRestart?: () => void;
  showDetails?: boolean;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ 
  visible, 
  error, 
  onDismiss, 
  onRetry, 
  onRestart,
  showDetails = false 
}) => {
  if (!visible || !error) return null;

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  const getErrorTitle = () => {
    if (error.errorBoundary) {
      return 'Something went wrong';
    }
    if (error.context) {
      return `Error in ${error.context}`;
    }
    return 'Unexpected Error';
  };

  const getErrorMessage = () => {
    // Provide user-friendly messages for common errors
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }
    
    if (message.includes('authentication') || message.includes('unauthorized')) {
      return 'Authentication failed. Please reconnect your wallet and try again.';
    }
    
    if (message.includes('wallet')) {
      return 'There was an issue with your wallet connection. Please try reconnecting.';
    }
    
    if (message.includes('game')) {
      return 'A game error occurred. Your progress has been saved. Please restart the game.';
    }
    
    // Fallback to original message if it's user-friendly, otherwise provide generic message
    if (error.message.length < 100 && !error.message.includes('undefined') && !error.message.includes('null')) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again or restart the app if the problem persists.';
  };

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{getErrorTitle()}</Text>
          {error.timestamp && (
            <Text style={styles.timestamp}>{formatTimestamp(error.timestamp)}</Text>
          )}
        </View>
        
        <ScrollView 
          style={styles.contentContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.message}>{getErrorMessage()}</Text>
          
          {showDetails && error.stack && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Technical Details:</Text>
              <ScrollView style={styles.stackContainer} nestedScrollEnabled>
                <Text style={styles.stackTrace}>{error.stack}</Text>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.button} onPress={onRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          
          {onRestart && (
            <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={onRestart}>
              <Text style={styles.buttonText}>Restart App</Text>
            </TouchableOpacity>
          )}
          
          {onDismiss && (
            <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={onDismiss}>
              <Text style={[styles.buttonText, styles.dismissButtonText]}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.placeholder,
    fontFamily: 'monospace',
  },
  contentContainer: {
    flex: 1,
    maxHeight: 300,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.text.dark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  stackContainer: {
    maxHeight: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  stackTrace: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restartButton: {
    backgroundColor: Colors.secondary.orange,
  },
  dismissButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.text.placeholder,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  dismissButtonText: {
    color: Colors.text.placeholder,
  },
});

export default ErrorOverlay;
