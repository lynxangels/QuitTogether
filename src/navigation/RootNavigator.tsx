import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { View, ActivityIndicator, Text } from 'react-native';

// Auth
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Onboarding
import { RoleSelectionScreen } from '../screens/onboarding/RoleSelectionScreen';
import { SmokerOnboardingScreen } from '../screens/onboarding/SmokerOnboardingScreen';
import { CompanionOnboardingScreen } from '../screens/onboarding/CompanionOnboardingScreen';

// Tabs
import { SmokerTabs } from './SmokerTabs';
import { CompanionTabs } from './CompanionTabs';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelection: undefined;
  SmokerOnboarding: undefined;
  CompanionOnboarding: undefined;
  SmokerMain: undefined;
  CompanionMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F3EE',
  },
};

export const RootNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'smoker' | 'companion' | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Listen to user document in real time
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), (userDoc) => {
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role || null);
            setOnboardingCompleted(data.onboardingCompleted || false);
          } else {
            setRole(null);
            setOnboardingCompleted(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user doc:", error);
          setLoading(false);
        });
      } else {
        setRole(null);
        setOnboardingCompleted(false);
        setLoading(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F7F3EE",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#5BA86A" />
        <Text style={{ marginTop: 12, color: "#1A1A1A" }}>
          Loading QuitTogether...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F7F3EE' } }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : !onboardingCompleted ? (
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="SmokerOnboarding" component={SmokerOnboardingScreen} />
            <Stack.Screen name="CompanionOnboarding" component={CompanionOnboardingScreen} />
          </>
        ) : role === 'smoker' ? (
          <Stack.Screen name="SmokerMain" component={SmokerTabs} />
        ) : role === 'companion' ? (
          <Stack.Screen name="CompanionMain" component={CompanionTabs} />
        ) : (
          // Fallback
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
