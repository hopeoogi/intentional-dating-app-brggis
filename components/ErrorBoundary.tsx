
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
// BUILD 162 - ENHANCED ERROR BOUNDARY
// ============================================================================
// Improvements:
// 1. Track error count to prevent infinite loops
// 2. Better state management before navigation
// 3. Multiple navigation fallbacks
// 4. Enhanced logging for debugging
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
    console.error('[ErrorBoundary] Caught error - BUILD 162');
    console.error('[ErrorBoundary] Error:', error);
    console.error('[ErrorBoundary] Error message:', error.message);
    console.error('[ErrorBoundary] Error stack:', error.stack);
    console.error('[ErrorBoundary] Error Info:', errorInfo);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    console.error('[ErrorBoundary] Error count:', this.state.errorCount + 1);
    console.error('='.repeat(80));

    // Increment error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReset = () => {
    console.log('[ErrorBoundary] User clicked reset button');
    console.log('[ErrorBoundary] Current error count:', this.state.errorCount);
    
    // Prevent infinite loops
    if (this.state.errorCount > 5) {
      console.error('[ErrorBoundary] Too many errors, not attempting navigation');
      return;
    }

    console.log('[ErrorBoundary] Clearing error state...');
    
    // Clear the error state FIRST
    this.setState({ 
      hasError: false, 
      error: null,
    }, () => {
      console.log('[ErrorBoundary] Error state cleared, navigating to signin...');
      
      // Use a small delay to ensure state is cleared before navigation
      setTimeout(() => {
        this.attemptNavigation();
      }, 100);
    });
  };

  attemptNavigation = () => {
    try {
      console.log('[ErrorBoundary] Attempting replace navigation...');
      router.replace('/signin');
      console.log('[ErrorBoundary] Replace navigation successful');
    } catch (replaceError) {
      console.error('[ErrorBoundary] Replace navigation error:', replaceError);
      
      // Try push navigation
      setTimeout(() => {
        try {
          console.log('[ErrorBoundary] Attempting push navigation...');
          router.push('/signin');
          console.log('[ErrorBoundary] Push navigation successful');
        } catch (pushError) {
          console.error('[ErrorBoundary] Push navigation error:', pushError);
          
          // Try navigate as last resort
          setTimeout(() => {
            try {
              console.log('[ErrorBoundary] Attempting navigate...');
              router.navigate('/signin');
              console.log('[ErrorBoundary] Navigate successful');
            } catch (navError) {
              console.error('[ErrorBoundary] All navigation methods failed:', navError);
            }
          }, 500);
        }
      }, 500);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.message}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          {this.state.errorCount > 5 ? (
            <Text style={styles.warningText}>
              Too many errors detected. Please restart the app.
            </Text>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={this.handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Proceed to Log In</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  warningText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
