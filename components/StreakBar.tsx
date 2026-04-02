import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StreakDay, DayStatus } from '../constants/data';

interface StreakBarProps {
  days: StreakDay[];
}

const statusStyle: Record<DayStatus, { bg: string; dot: string; border: string }> = {
  clean:    { bg: Colors.greenPale,  dot: Colors.greenLight, border: Colors.greenLight },
  craving:  { bg: Colors.amberLight, dot: Colors.amber,      border: Colors.amber },
  relapsed: { bg: Colors.rosePale,   dot: Colors.rose,       border: Colors.rose },
  today:    { bg: Colors.greenMid,   dot: Colors.white,      border: Colors.greenDark },
  future:   { bg: Colors.creamDark,  dot: '#C8B89A',         border: 'transparent' },
};

export default function StreakBar({ days }: StreakBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {days.map((day, i) => {
        const s = statusStyle[day.status];
        return (
          <View
            key={i}
            style={[styles.cell, { backgroundColor: s.bg, borderColor: s.border }]}
          >
            <View style={[styles.dot, { backgroundColor: s.dot }]} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 12 },
  container: { paddingHorizontal: 20, gap: 6 },
  cell: {
    width: 36,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
