import React, { Component, ReactNode } from 'react';
import { ErrorInfo } from './ErrorOverlay';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: ErrorInfo) => void;
  fallback?: (error: ErrorInfo, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      errorBoundary: true,
      context: 'React Component',
    };

    return {
      hasError: true,
      error: errorInfo,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.log('ErrorBoundary caught an error:', error, errorInfo);
    
    // Create enhanced error info
    const enhancedError: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      errorBoundary: true,
      context: 'React Component',
    };

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(enhancedError);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      // Default fallback UI - just reset the error state
      // The parent component should handle showing the ErrorOverlay
      return this.props.children;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
