import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const StatisticsIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <Path d="M4 8h16" />
    <Path d="M8 4v4" />
    <Path d="M8 12h8" />
    <Path d="M8 16h6" />
  </Svg>
);

const CompanionIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const CravingIcon = () => (
  <Svg viewBox="0 0 26 26" width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
    <Path d="M13 4 C13 4 7 9 7 14 a6 6 0 0 0 12 0 C19 9 13 4 13 4Z" fill="rgba(255,255,255,0.25)"/>
    <Path d="M10 15 q3-3 6 0" strokeWidth="1.8"/>
  </Svg>
);

export type TabName = 'home' | 'statistics' | 'craving' | 'companion' | 'profile';

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export const BottomNav = ({ activeTab, onTabPress }: Props) => {
  const tabs: { id: TabName; label: string; Icon?: React.FC<{color: string}> }[] = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'statistics', label: 'Statistics', Icon: StatisticsIcon },
    { id: 'craving', label: 'I\'m Craving', Icon: CravingIcon },
    { id: 'companion', label: 'Companion', Icon: CompanionIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isCraving = tab.id === 'craving';

        if (isCraving) {
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              style={styles.cravingWrapper}
              onPress={() => onTabPress(tab.id as TabName)}
            >
              <View style={styles.cravingLabelBg}>
                <Text style={styles.cravingLabelText}>I'm Craving</Text>
              </View>
              <View style={styles.cravingBtn}>
                <CravingIcon />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.id as TabName)}
          >
            <View style={[styles.iconContainer, { backgroundColor: isActive ? '#4A7C59' : '#DDD3C0' }]}>
              {tab.Icon && <tab.Icon color={isActive ? '#FFFFFF' : '#8B7355'} />}
            </View>
            <Text style={[styles.tabLabel, { color: isActive ? '#4A7C59' : '#8B7355', fontWeight: isActive ? '700' : '500' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F3EE',
    borderTopWidth: 1,
    borderTopColor: '#DDD3C0',
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    marginTop: 6
  },
  cravingWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -38,
    zIndex: 20
  },
  cravingLabelBg: {
    backgroundColor: '#EDF5E8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#5BA86A',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  cravingLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3A6147'
  },
  cravingBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#4A7C59',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#F7F3EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A7C59',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabLabel: {
    fontSize: 10,
    textTransform: 'capitalize'
  }
});
