import { useCallback } from 'react';
import { errorHandler } from '../utils/ErrorHandler';

/**
 * Custom hook for error handling in components
 * Provides convenient methods for handling different types of errors
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error: any, context?: string) => {
    errorHandler.handleError(error, context);
  }, []);

  const handleAsyncError = useCallback((error: any, context?: string) => {
    errorHandler.handleAsyncError(error, context);
  }, []);

  const handleNetworkError = useCallback((error: any, context?: string) => {
    errorHandler.handleNetworkError(error, context);
  }, []);

  const handleGameError = useCallback((error: any, context?: string) => {
    errorHandler.handleGameError(error, context);
  }, []);

  const handleAuthError = useCallback((error: any, context?: string) => {
    errorHandler.handleAuthError(error, context);
  }, []);

  const wrapAsync = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: string
  ): T => {
    return errorHandler.wrapAsync(fn, context);
  }, []);

  const wrapSync = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    context?: string
  ): T => {
    return errorHandler.wrapSync(fn, context);
  }, []);

  return {
    handleError,
    handleAsyncError,
    handleNetworkError,
    handleGameError,
    handleAuthError,
    wrapAsync,
    wrapSync,
  };
};

export default useErrorHandler;
