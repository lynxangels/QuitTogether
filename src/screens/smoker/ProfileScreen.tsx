import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { auth, db } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Svg, { Path } from 'react-native-svg';

const ChevronRight = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const uDoc = await getDoc(doc(db, 'users', user.uid));
      if (uDoc.exists()) setUserDoc(uDoc.data());

      const pDoc = await getDoc(doc(db, 'smokerProfiles', user.uid));
      if (pDoc.exists()) setProfile(pDoc.data());
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const name = userDoc?.name || auth.currentUser?.email?.split('@')[0] || 'Smoker';
  const initials = name.substring(0, 2).toUpperCase();
  const userId = profile?.referralCode || 'Tidak ada kode';
  const email = auth.currentUser?.email || '-';

  const quitDate = profile?.quitStartDate ? new Date(profile.quitStartDate) : new Date();
  const formattedQuitDate = quitDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const daysSinceQuit = Math.floor(Math.max(0, new Date().getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.idText}>ID: {userId}</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add companion</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
        <View style={styles.cardGroup}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{name.replace(' I.', '')}</Text>
            </View>
            <ChevronRight />
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
            <ChevronRight />
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>First day of stopping</Text>
              <Text style={styles.infoValue}>{formattedQuitDate}</Text>
            </View>
            <View style={styles.badgeDays}>
              <Text style={styles.badgeDaysText}>{daysSinceQuit}d</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
    paddingHorizontal: 24,
    letterSpacing: -0.5
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 24, // Squircle look
    backgroundColor: '#EDF5E8',
    borderWidth: 1,
    borderColor: '#81C784',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A694B'
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  idText: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 20
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B7355'
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7355'
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B7355',
    alignItems: 'center'
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F' // Redish
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B7355',
    borderRadius: 24,
    marginBottom: 32,
    overflow: 'hidden'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDF5E8',
    borderWidth: 1,
    borderColor: '#81C784',
    marginRight: 16
  },
  infoTextContainer: {
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBE1',
    marginLeft: 72
  },
  badgeDays: {
    backgroundColor: '#EDF5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeDaysText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A694B'
  },
  historyContainer: {
    marginBottom: 24
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  badgeRelapsed: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16
  },
  badgeRelapsedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D32F2F'
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8B89A',
    borderRadius: 20,
    padding: 20
  },
  historyTime: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 8
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  historyDesc: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 16
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B7355'
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8B7355'
  }
});
