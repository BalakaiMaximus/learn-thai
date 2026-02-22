import { ErrorInfo } from '../components/ErrorOverlay';

// Global error handler for the app
class ErrorHandler {
  private errorCallback?: (error: ErrorInfo) => void;

  // Set the callback function that will handle errors
  setErrorCallback(callback: (error: ErrorInfo) => void) {
    this.errorCallback = callback;
  }

  // Handle different types of errors
  handleError(error: any, context?: string) {
    const errorInfo: ErrorInfo = this.createErrorInfo(error, context);
    
    // Log error for debugging
    console.log('ErrorHandler:', errorInfo);
    
    // Call the callback if set
    if (this.errorCallback) {
      this.errorCallback(errorInfo);
    }
  }

  // Handle async errors (Promise rejections)
  handleAsyncError(error: any, context?: string) {
    this.handleError(error, context || 'Async Operation');
  }

  // Handle network errors specifically
  handleNetworkError(error: any, context?: string) {
    const networkError = {
      ...error,
      message: error.message || 'Network request failed',
    };
    this.handleError(networkError, context || 'Network Request');
  }

  // Handle game-specific errors
  handleGameError(error: any, context?: string) {
    const gameError = {
      ...error,
      message: error.message || 'Game error occurred',
    };
    this.handleError(gameError, context || 'Game Engine');
  }

  // Handle authentication errors
  handleAuthError(error: any, context?: string) {
    const authError = {
      ...error,
      message: error.message || 'Authentication failed',
    };
    this.handleError(authError, context || 'Authentication');
  }

  // Create standardized error info
  private createErrorInfo(error: any, context?: string): ErrorInfo {
    let message = 'An unknown error occurred';
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = error.message || error.toString();
      stack = error.stack;
    }

    return {
      message,
      stack,
      timestamp: Date.now(),
      errorBoundary: false,
      context,
    };
  }

  // Wrap async functions with error handling
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: string
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleAsyncError(error, context);
        throw error; // Re-throw so the calling code can handle it too
      }
    }) as T;
  }

  // Wrap sync functions with error handling
  wrapSync<T extends (...args: any[]) => any>(
    fn: T,
    context?: string
  ): T {
    return ((...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, context);
        throw error; // Re-throw so the calling code can handle it too
      }
    }) as T;
  }
}

// Global instance
export const errorHandler = new ErrorHandler();

// Utility functions for common error handling patterns
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handleAsyncError(error, context);
    throw error;
  }
};

export const handleSyncOperation = <T>(
  operation: () => T,
  context?: string
): T => {
  try {
    return operation();
  } catch (error) {
    errorHandler.handleError(error, context);
    throw error;
  }
};

// Setup global error handlers for React Native
export const setupGlobalErrorHandling = () => {
  // For React Native, we can use ErrorUtils if available
  if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
    const originalHandler = (global as any).ErrorUtils.getGlobalHandler();
    (global as any).ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      // Only handle non-fatal errors through our system to avoid interfering with crash reporting
      if (!isFatal) {
        errorHandler.handleError(error, 'Global Error');
      }
      // Always call the original handler to maintain default behavior
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  // For promise rejections, we'll rely on manual handling in the code
  // since React Native doesn't have a reliable global promise rejection handler
  console.log('Global error handling setup complete for React Native');
};
