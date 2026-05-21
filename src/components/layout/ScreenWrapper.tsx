import React from 'react';
import { SafeAreaView, View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenWrapper = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3EE', // MATCH container color to prevent edge borders
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  }
});
