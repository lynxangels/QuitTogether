import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/companion/DashboardScreen';
import { ProfileScreen } from '../screens/companion/ProfileScreen';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type CompanionTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<CompanionTabParamList>();

const CompanionBottomNav = ({ state, navigation }: any) => {
  const isHome = state.index === 0;
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <View style={[styles.iconBox, { backgroundColor: isHome ? '#3A6147' : '#DDD3C0' }]} />
        <Text style={[styles.navText, { color: isHome ? '#3A6147' : '#8B7355' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <View style={[styles.iconBox, { backgroundColor: !isHome ? '#3A6147' : '#DDD3C0' }]} />
        <Text style={[styles.navText, { color: !isHome ? '#3A6147' : '#8B7355' }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export const CompanionTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CompanionBottomNav {...props} />}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 90, 
    backgroundColor: '#F7F3EE', 
    borderTopWidth: 1.5, 
    borderTopColor: '#DDD3C0', 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    zIndex: 10 
  },
  navItem: { flex: 1, alignItems: 'center' },
  iconBox: { width: 24, height: 24, borderRadius: 8, marginBottom: 6 },
  navText: { fontSize: 11, fontWeight: '600' }
});
