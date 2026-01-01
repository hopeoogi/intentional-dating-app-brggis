
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

// ============================================================================
// BUILD 163 - ENHANCED ERROR BOUNDARY WITH BETTER RECOVERY
// ============================================================================
// Improvements:
// 1. Better error recovery with app restart option
// 2. Simplified navigation logic
// 3. Clear error messages for users
// 4. Prevent infinite error loops
// ============================================================================

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('='.repeat(80));
    console.error('[ErrorBoundary] Caught error - BUILD 163');
    console.error('[ErrorBoundary] Error:', error);
    console.error('[ErrorBoundary] Error message:', error.message);
    console.error('[ErrorBoundary] Error stack:', error.stack);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    console.error('[ErrorBoundary] Error count:', this.state.errorCount + 1);
    console.error('='.repeat(80));

    // Increment error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReset = () => {
    console.log('[ErrorBoundary] User requested reset');
    
    // Prevent infinite loops
    if (this.state.errorCount > 3) {
      console.error('[ErrorBoundary] Too many errors, showing restart message');
      return;
    }

    // Clear error state
    this.setState({ 
      hasError: false, 
      error: null,
    });

    // Navigate to signin
    try {
      console.log('[ErrorBoundary] Navigating to signin...');
      router.replace('/signin');
    } catch (navError) {
      console.error('[ErrorBoundary] Navigation failed:', navError);
      // If navigation fails, just clear the error and let the app try to recover
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      const tooManyErrors = this.state.errorCount > 3;

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something Went Wrong</Text>
          <Text style={styles.message}>
            {tooManyErrors 
              ? 'The app encountered multiple errors. Please restart the app.'
              : 'We encountered an unexpected error. Don&apos;t worry, your data is safe.'}
          </Text>
          
          {this.state.error && (
            <Text style={styles.errorText}>
              {this.state.error.message}
            </Text>
          )}

          {!tooManyErrors && (
            <TouchableOpacity 
              style={styles.button} 
              onPress={this.handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Continue to Sign In</Text>
            </TouchableOpacity>
          )}

          {tooManyErrors && (
            <Text style={styles.restartText}>
              Please close and restart the app
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.7,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  restartText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
});
