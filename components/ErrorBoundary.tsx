
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
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('='.repeat(80));
    console.error('[ErrorBoundary] Caught error - BUILD 161');
    console.error('[ErrorBoundary] Error:', error);
    console.error('[ErrorBoundary] Error message:', error.message);
    console.error('[ErrorBoundary] Error stack:', error.stack);
    console.error('[ErrorBoundary] Error Info:', errorInfo);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    console.error('='.repeat(80));
  }

  handleReset = () => {
    console.log('[ErrorBoundary] User clicked reset button');
    console.log('[ErrorBoundary] Clearing error state...');
    
    // Clear the error state FIRST
    this.setState({ hasError: false, error: null }, () => {
      console.log('[ErrorBoundary] Error state cleared, navigating to signin...');
      
      // Use a small delay to ensure state is cleared before navigation
      setTimeout(() => {
        try {
          router.replace('/signin');
          console.log('[ErrorBoundary] Navigation successful');
        } catch (navError) {
          console.error('[ErrorBoundary] Navigation error:', navError);
          // If navigation fails, try pushing instead
          try {
            router.push('/signin');
            console.log('[ErrorBoundary] Push navigation successful');
          } catch (pushError) {
            console.error('[ErrorBoundary] Push navigation also failed:', pushError);
          }
        }
      }, 100);
    });
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
          <TouchableOpacity 
            style={styles.button} 
            onPress={this.handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Proceed to Log In</Text>
          </TouchableOpacity>
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
