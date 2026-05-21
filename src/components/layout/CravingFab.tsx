import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  onPress: () => void;
}

export const CravingFab = ({ onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.fabLabel}>I'm Craving</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Svg viewBox="0 0 26 26" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <Path d="M13 4 C13 4 7 9 7 14 a6 6 0 0 0 12 0 C19 9 13 4 13 4Z" fill="rgba(255,255,255,0.25)"/>
          <Path d="M10 15 q3-3 6 0" strokeWidth="1.8"/>
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 46, left: '50%', marginLeft: -35, alignItems: 'center', zIndex: 20, width: 70 },
  fabLabel: { fontSize: 9, fontWeight: '600', color: '#3A6147', backgroundColor: '#EDF5E8', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: '#5BA86A', marginBottom: 4 },
  button: { width: 56, height: 56, backgroundColor: '#4A7C59', borderRadius: 18, borderWidth: 3, borderColor: '#F7F3EE', alignItems: 'center', justifyContent: 'center', shadowColor: '#4A7C59', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 6 }
});
