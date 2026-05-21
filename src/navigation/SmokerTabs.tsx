import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/smoker/HomeScreen';
import { StatisticsScreen } from '../screens/smoker/StatisticsScreen';
import { CompanionScreen } from '../screens/smoker/CompanionScreen';
import { ProfileScreen } from '../screens/smoker/ProfileScreen';
import { BottomNav } from '../components/layout/BottomNav';
import { CravingModal } from '../components/craving/CravingModal';

export type SmokerTabParamList = {
  Home: undefined;
  Statistics: undefined;
  Companion: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<SmokerTabParamList>();

export const SmokerTabs = () => {
  const [isCravingModalVisible, setIsCravingModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <BottomNav
            activeTab={props.state.routeNames[props.state.index].toLowerCase() as any}
            onTabPress={(tab) => {
              if (tab === 'craving') {
                setIsCravingModalVisible(true);
                return;
              }
              const routes: Record<string, keyof SmokerTabParamList> = {
                home: 'Home',
                statistics: 'Statistics',
                companion: 'Companion',
                profile: 'Profile',
              };
              props.navigation.navigate(routes[tab]);
            }}
          />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen name="Companion" component={CompanionScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <CravingModal 
        visible={isCravingModalVisible} 
        onClose={() => setIsCravingModalVisible(false)} 
        onComplete={() => {}} 
      />
    </>
  );
};
