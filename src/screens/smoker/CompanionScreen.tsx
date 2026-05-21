import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export const CompanionScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [companionUser, setCompanionUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Use onSnapshot so we see when companion connects
    const unsubscribe = onSnapshot(doc(db, 'smokerProfiles', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({ id: docSnap.id, ...data });
        
        // Fetch companion details if connected
        if (data.activeCompanion && data.companionId) {
          getDoc(doc(db, 'users', data.companionId)).then(uDoc => {
            if (uDoc.exists()) {
              setCompanionUser(uDoc.data());
            }
          });
        } else {
          setCompanionUser(null);
        }
      }
    });
    return unsubscribe;
  }, []);

  const generateCode = async () => {
    if (!profile) return;
    setIsGenerating(true);
    const newCode = 'QT-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    await updateDoc(doc(db, 'smokerProfiles', auth.currentUser!.uid), {
      referralCode: newCode
    });
    setIsGenerating(false);
  };

  if (!profile) return null;

  const compName = companionUser?.name || 'Companion Aktif';
  const compInitial = compName.substring(0, 1).toUpperCase();

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Companion</Text>
      
      {!profile.activeCompanion ? (
        <View style={styles.emptyContainer}>
          {profile.referralCode ? (
             <View style={styles.codeContainer}>
               <Text style={styles.codeLabel}>Berikan kode ini ke pendamping Anda:</Text>
               <View style={styles.codeBox}>
                 <Text style={styles.codeValue}>{profile.referralCode}</Text>
               </View>
               <Text style={styles.codeDesc}>Menunggu pendamping untuk terhubung...</Text>
             </View>
          ) : (
            <>
              <Text style={styles.emptyTitle}>Anda belum punya pendamping</Text>
              <Text style={styles.emptySubtitle}>
                Pendamping (Companion) adalah orang yang dapat memantau progres Anda dan memberi dukungan saat Anda mengalami craving.
              </Text>
              
              <TouchableOpacity style={styles.addButton} onPress={generateCode} disabled={isGenerating}>
                {isGenerating ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Generate Kode Invite</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.activeCard}>
          <View style={styles.activeRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{compInitial}</Text>
            </View>
            <View style={styles.activeInfo}>
              <Text style={styles.activeName}>{compName}</Text>
              <Text style={styles.activeStatus}>Memantau pohonmu</Text>
            </View>
            <View style={styles.statusDot} />
          </View>
          <TouchableOpacity 
            style={styles.disconnectButton}
            onPress={async () => {
              Alert.alert('Lepaskan Companion', 'Yakin ingin melepaskan companion ini?', [
                { text: 'Batal', style: 'cancel' },
                { 
                  text: 'Lepaskan', 
                  style: 'destructive',
                  onPress: async () => {
                    await updateDoc(doc(db, 'smokerProfiles', profile.userId), {
                      activeCompanion: false,
                      companionId: null
                    });
                    setProfile({ ...profile, activeCompanion: false });
                    setCompanionUser(null);
                  }
                }
              ])
            }}
          >
            <Text style={styles.disconnectText}>Lepaskan Companion</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 48, // Notch offset
    flex: 1,
    backgroundColor: '#F7F3EE'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
    letterSpacing: -0.5
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100 // offset for bottom nav
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center'
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#8B7355',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16
  },
  addButton: {
    backgroundColor: '#4A694B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD3C0',
    borderRadius: 16,
    padding: 16
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#81C784'
  },
  avatarText: {
    color: '#2E7D32',
    fontWeight: '600'
  },
  activeInfo: {
    flex: 1
  },
  activeName: {
    fontWeight: '600',
    color: '#1A1A1A'
  },
  activeStatus: {
    fontSize: 12,
    color: '#666666'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#81C784'
  },
  disconnectButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F43F5E',
    borderRadius: 12,
    backgroundColor: '#FDECEA'
  },
  disconnectText: {
    color: '#F43F5E',
    fontWeight: '500',
    fontSize: 14
  },
  codeContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD3C0'
  },
  codeLabel: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 16
  },
  codeBox: {
    backgroundColor: '#EDF5E8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#5BA86A',
    marginBottom: 16
  },
  codeValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3A6147',
    letterSpacing: 4
  },
  codeDesc: {
    fontSize: 13,
    color: '#8B7355',
    textAlign: 'center'
  }
});
