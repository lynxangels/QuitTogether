import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import Svg, { Path } from 'react-native-svg';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const ArrowRight = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

const ArrowLeft = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

export const RoleSelectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Top Bar for Back/Logout */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
          <ArrowLeft color="#8B7355" />
          <Text style={styles.backText}>Kembali ke Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pilih Peranmu</Text>
          <Text style={styles.subtitle}>Apakah kamu ingin berhenti merokok, atau membantu seseorang berhenti?</Text>
        </View>
        
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.card, styles.smokerCard]}
            onPress={() => navigation.navigate('SmokerOnboarding')}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconBgSmoker}>
              <Text style={styles.emoji}>🌱</Text>
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitleSmoker}>Aku Ingin Berhenti</Text>
              <Text style={styles.cardDescSmoker}>Bangun kebiasaan baru, pantau progres, dan rawat pohon janjimu.</Text>
            </View>
            <ArrowRight color="#4A7C59" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.companionCard]}
            onPress={() => navigation.navigate('CompanionOnboarding')}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconBgCompanion}>
              <Text style={styles.emoji}>🤝</Text>
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitleCompanion}>Aku Ingin Membantu</Text>
              <Text style={styles.cardDescCompanion}>Jadi pendamping untuk memantau progres dan memberi semangat.</Text>
            </View>
            <ArrowRight color="#8B7355" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE'
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    padding: 8,
  },
  backText: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 40,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#8B7355',
    lineHeight: 22,
    paddingHorizontal: 10
  },
  cardsContainer: {
    gap: 20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 16
  },
  emoji: {
    fontSize: 28
  },
  // Smoker styling
  smokerCard: {
    backgroundColor: '#EDF5E8',
    borderColor: '#5BA86A',
  },
  cardIconBgSmoker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#A1BCA8'
  },
  cardTitleSmoker: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A6147',
    marginBottom: 6
  },
  cardDescSmoker: {
    fontSize: 13,
    color: '#5BA86A',
    lineHeight: 18
  },
  // Companion styling
  companionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD3C0',
  },
  cardIconBgCompanion: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F7F3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E8E2D8'
  },
  cardTitleCompanion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6
  },
  cardDescCompanion: {
    fontSize: 13,
    color: '#8B7355',
    lineHeight: 18
  }
});
