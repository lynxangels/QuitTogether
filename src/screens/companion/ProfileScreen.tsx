import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Switch, Platform } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { auth, db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Svg, { Path } from 'react-native-svg';

const ChevronRight = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const ProfileScreen = () => {
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [smokerUser, setSmokerUser] = useState<any>(null);
  const [smokerProfile, setSmokerProfile] = useState<any>(null);
  const [alertCraving, setAlertCraving] = useState(true);
  const [weeklyUpdate, setWeeklyUpdate] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Listen to current user
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserData(docSnap.data());
      }
    });

    // Listen to linked smoker
    const q = query(collection(db, 'smokerProfiles'), where('companionId', '==', user.uid));
    const unsubscribeSmoker = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const p = snapshot.docs[0].data();
        const docId = snapshot.docs[0].id;
        setSmokerProfile({ id: docId, ...p });
        
        // Fallback to docId if userId is missing
        const targetUserId = p.userId || docId;
        
        getDoc(doc(db, 'users', targetUserId)).then(uDoc => {
          if (uDoc.exists()) setSmokerUser(uDoc.data());
        });
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeSmoker();
    };
  }, []);

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => signOut(auth) }
    ]);
  };

  const handleUnlink = () => {
    Alert.alert('Lepaskan', 'Yakin ingin melepaskan koneksi dengan teman Anda?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Lepaskan', style: 'destructive', onPress: () => {
        Alert.alert('Info', 'Fitur ini sedang dalam pengembangan.');
      }}
    ]);
  };

  const name = currentUserData?.name || 'Companion';
  const initials = name.substring(0, 2).toUpperCase();
  const email = auth.currentUser?.email || '-';
  const joinDate = currentUserData?.createdAt ? new Date(currentUserData.createdAt) : new Date();
  const formattedJoinDate = joinDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  let smokerShort = 'SM';
  let smokerName = 'Menunggu Koneksi...';
  let daysConnected = 0;

  if (smokerUser) {
    smokerName = smokerUser.name || 'Temanmu';
    smokerShort = smokerName.substring(0, 2).toUpperCase();
  }

  if (smokerProfile?.updatedAt) {
    const connectDate = new Date(smokerProfile.updatedAt);
    const diff = Math.abs(new Date().getTime() - connectDate.getTime());
    daysConnected = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `Rp${(amount/1000000).toFixed(1)}M`;
    if (amount >= 1000) return `Rp${Math.floor(amount/1000)}k`;
    return `Rp${Math.floor(amount)}`;
  };

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
          <Text style={styles.idText}>Companion Mode</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>INFORMASI AKUN</Text>
        <View style={styles.cardGroup}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#E6F0FF', borderColor: '#90CAF9' }]}>
              <Text style={styles.iconEmoji}>📧</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
            <ChevronRight />
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#FFF9E6', borderColor: '#FFE082' }]}>
              <Text style={styles.iconEmoji}>📅</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Bergabung Sejak</Text>
              <Text style={styles.infoValue}>{formattedJoinDate}</Text>
            </View>
          </View>
        </View>

        {/* Koneksi Companion */}
        <Text style={styles.sectionTitle}>KONEKSI COMPANION</Text>
        <View style={styles.cardGroup}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#F0F7F2', borderColor: '#81C784' }]}>
              <Text style={styles.iconEmoji}>🤝</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Mendampingi</Text>
              <Text style={styles.infoValue}>{smokerName}</Text>
            </View>
            <View style={styles.badgeDays}>
              <Text style={styles.badgeDaysText}>{daysConnected} hari</Text>
            </View>
          </View>

          {smokerUser?.email && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={[styles.infoIconBox, { backgroundColor: '#E6F0FF', borderColor: '#90CAF9' }]}>
                  <Text style={styles.iconEmoji}>📧</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email Smoker</Text>
                  <Text style={styles.infoValue}>{smokerUser.email}</Text>
                </View>
              </View>
            </>
          )}

          {smokerProfile && (
            <>
              <View style={styles.divider} />
              <View style={styles.progressContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>🚬 Bersih</Text>
                  <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarFill, { width: '80%', backgroundColor: '#5BA86A' }]} />
                  </View>
                  <Text style={styles.progressValue}>{(smokerProfile?.cigarettesPerDay * daysConnected) || 0} bt</Text>
                </View>

                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>💰 Tersimpan</Text>
                  <View style={styles.progressBarWrapper}>
                    <View style={[styles.progressBarFill, { width: '60%', backgroundColor: '#F2C94C' }]} />
                  </View>
                  <Text style={styles.progressValue}>{formatMoney((((smokerProfile?.cigarettesPerDay * daysConnected) || 0) / 20) * smokerProfile?.packPrice || 0)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.unlinkButton} onPress={handleUnlink}>
                <Text style={styles.unlinkButtonText}>Lepaskan Koneksi</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Notifikasi */}
        <Text style={styles.sectionTitle}>PENGATURAN NOTIFIKASI</Text>
        <View style={styles.cardGroup}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#FFEBE6', borderColor: '#EF9A9A' }]}>
              <Text style={styles.iconEmoji}>🔔</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoValue}>Alert Craving</Text>
              <Text style={styles.infoLabel}>Langsung saat dia craving</Text>
            </View>
            <Switch
              value={alertCraving}
              onValueChange={setAlertCraving}
              trackColor={{ false: '#E8E2D8', true: '#5BA86A' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#E6FAF5', borderColor: '#80CBC4' }]}>
              <Text style={styles.iconEmoji}>📊</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoValue}>Update Mingguan</Text>
              <Text style={styles.infoLabel}>Ringkasan progres mingguan</Text>
            </View>
            <Switch
              value={weeklyUpdate}
              onValueChange={setWeeklyUpdate}
              trackColor={{ false: '#E8E2D8', true: '#5BA86A' }}
              thumbColor="#FFFFFF"
            />
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
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#8B7355'
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
    color: '#D32F2F'
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1
  },
  iconEmoji: {
    fontSize: 18
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
  progressContainer: {
    padding: 16,
    paddingLeft: 72,
    paddingRight: 16,
    paddingTop: 0,
    paddingBottom: 8
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  progressLabel: {
    width: 70,
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500'
  },
  progressBarWrapper: {
    flex: 1,
    height: 6,
    backgroundColor: '#E8E2D8',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  progressValue: {
    width: 60,
    fontSize: 11,
    color: '#8B7355',
    textAlign: 'right',
    fontWeight: '600'
  },
  unlinkButton: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FDECEA'
  },
  unlinkButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 13
  }
});
