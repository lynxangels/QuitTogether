import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { auth, db } from '../../firebase/config';
import { collection, query, where, onSnapshot, addDoc, doc } from 'firebase/firestore';

export const DashboardScreen = () => {
  const [smokerProfile, setSmokerProfile] = useState<any>(null);
  const [smokerUser, setSmokerUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [rawMsgs, setRawMsgs] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    let unsubUser: any;
    let unsubLogs: any;
    let unsubMsgs: any;

    const q = query(collection(db, 'smokerProfiles'), where('companionId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const p = snapshot.docs[0].data();
        const docId = snapshot.docs[0].id;
        setSmokerProfile({ id: docId, ...p });
        
        const targetUserId = p.userId || docId;
        
        if (!unsubUser) {
          unsubUser = onSnapshot(doc(db, 'users', targetUserId), (uDoc) => {
            if (uDoc.exists()) setSmokerUser(uDoc.data());
            else setSmokerUser({ name: 'Temanmu' });
            setLoading(false);
          });
        }
        
        if (!unsubLogs) {
          const qLogs = query(collection(db, 'cravingLogs'), where('smokerId', '==', targetUserId));
          unsubLogs = onSnapshot(qLogs, (snap) => {
            const fetched = snap.docs.map(d => ({ id: d.id, activityType: 'craving', ...d.data() }));
            setRawLogs(fetched);
          });
        }

        if (!unsubMsgs) {
          const qMsgs = query(collection(db, 'supportMessages'), where('smokerId', '==', targetUserId));
          unsubMsgs = onSnapshot(qMsgs, (snap) => {
            const fetched = snap.docs.map(d => ({ id: d.id, activityType: 'message', ...d.data() }));
            setRawMsgs(fetched);
          });
        }
        
      } else {
        setSmokerProfile(null);
        setSmokerUser(null);
        setRawLogs([]);
        setRawMsgs([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubUser) unsubUser();
      if (unsubLogs) unsubLogs();
      if (unsubMsgs) unsubMsgs();
    };
  }, []);

  const sendNudge = async (message: string) => {
    if (!smokerProfile) return;
    try {
      await addDoc(collection(db, 'supportMessages'), {
        smokerId: smokerProfile.userId,
        companionId: auth.currentUser!.uid,
        message,
        createdAt: new Date().toISOString(),
        readAt: null
      });
      Alert.alert('Sukses', 'Pesan semangat berhasil dikirim!');
    } catch (e) {
      Alert.alert('Error', 'Gagal mengirim pesan');
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5BA86A" />
      </ScreenWrapper>
    );
  }

  if (!smokerProfile || !smokerUser) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Text style={styles.centerTitle}>Menunggu Koneksi</Text>
        <Text style={styles.centerSubtitle}>Kamu belum terhubung dengan siapa pun. Berikan kode undanganmu kepada teman yang ingin berhenti merokok.</Text>
      </ScreenWrapper>
    );
  }

  const name = smokerUser.name || 'Temanmu';
  const shortName = name.split(' ')[0];

  // Calculate Progress
  const quitDate = new Date(smokerProfile.quitStartDate);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - quitDate.getTime());
  const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const cigsAvoided = daysPassed * (smokerProfile.cigarettesPerDay || 0);
  const packsAvoided = cigsAvoided / (smokerProfile.cigarettesPerPack || 20);
  const moneySaved = packsAvoided * (smokerProfile.packPrice || 0);
  
  const cravingsSurvived = rawLogs.filter(l => l.status === 'survived').length;

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount/1000000).toFixed(1)}jt`;
    if (amount >= 1000) return `Rp ${Math.floor(amount/1000)}k`;
    return `Rp ${Math.floor(amount)}`;
  };

  const currentWater = smokerProfile.totalWater || 0;
  const thresholds = [0, 100, 300, 1000, 2000, 3500];
  let calcStage = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (currentWater >= thresholds[i]) {
      calcStage = i + 1;
      break;
    }
  }
  const treeStage = Math.max(calcStage, smokerProfile.treeStage || 1);
  
  const maxWater = thresholds[treeStage - 1] !== undefined && treeStage < 6 
    ? thresholds[treeStage] 
    : thresholds[thresholds.length - 1];
    
  const waterProgress = Math.min((currentWater / maxWater) * 100, 100);
  const waterLeft = maxWater - currentWater;

  const activities = [...rawLogs, ...rawMsgs].sort((a, b) => {
    const tA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt).getTime();
    const tB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt).getTime();
    return tB - tA;
  }).slice(0, 5);

  const formatActivityTime = (dateStr: string | any) => {
    try {
      const d = new Date(dateStr?.toDate ? dateStr.toDate() : dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QuitTogether</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>👀</Text>
          <Text style={styles.badgeText}>Companion Mode</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tree Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Air Pohon {shortName}</Text>
            <View style={styles.stageTag}>
              <Text style={styles.stageTagText}>Stage {treeStage}</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${waterProgress}%` }]} />
            </View>
          </View>
          
          <View style={styles.cardFooterRow}>
            <Text style={styles.progressText}>{currentWater} / {maxWater} air</Text>
            <Text style={styles.progressSubtext}>{waterLeft > 0 ? `${waterLeft} lagi → Naik Stage` : 'Siap naik stage!'}</Text>
          </View>
        </View>

        {/* Progress Grid */}
        <Text style={styles.sectionTitle}>PROGRESS {shortName.toUpperCase()}</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🚬</Text>
            </View>
            <Text style={styles.gridValue}>{cigsAvoided}</Text>
            <Text style={styles.gridLabel}>batang dihindari</Text>
          </View>
          
          <View style={styles.gridItem}>
            <View style={styles.iconCircleYellow}>
              <Text style={styles.iconEmoji}>💰</Text>
            </View>
            <Text style={styles.gridValue}>{formatMoney(moneySaved)}</Text>
            <Text style={styles.gridLabel}>uang tersimpan</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={styles.iconCircleBlue}>
              <Text style={styles.iconEmoji}>✓</Text>
            </View>
            <Text style={styles.gridValue}>{cravingsSurvived}</Text>
            <Text style={styles.gridLabel}>craving survived</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={styles.iconCircleRed}>
              <Text style={styles.iconEmoji}>⏱️</Text>
            </View>
            <Text style={styles.gridValue}>{daysPassed}</Text>
            <Text style={styles.gridLabel}>hari clean</Text>
          </View>
        </View>

        {/* Nudge Section */}
        <View style={styles.nudgeContainer}>
          <View style={styles.nudgeHeader}>
            <View style={styles.chatIconBg}>
              <Text style={styles.chatIcon}>💬</Text>
            </View>
            <View>
              <Text style={styles.nudgeTitle}>Pilih atau tulis pesan</Text>
              <Text style={styles.nudgeSubtitle}>{shortName} akan menerima notifikasi</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.nudgeBtn} onPress={() => sendNudge(`💪 Hei! Sudah ${daysPassed} hari bersih, luar biasa!`)}>
            <Text style={styles.nudgeBtnText}>💪  Hei! Sudah {daysPassed} hari bersih, luar biasa!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => sendNudge('🌱 Ingat pohonmu! Sebentar lagi tumbuh besar lho')}>
            <Text style={styles.nudgeBtnText}>🌱  Ingat pohonmu! Sebentar lagi tumbuh besar lho</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => sendNudge('🤝 Kamu nggak sendiri, aku pantau dari sini!')}>
            <Text style={styles.nudgeBtnText}>🤝  Kamu nggak sendiri, aku pantau dari sini!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => sendNudge(`🔥 ${cigsAvoided} batang rokok udah kamu hindari!`)}>
            <Text style={styles.nudgeBtnText}>🔥  {cigsAvoided} batang rokok udah kamu hindari!</Text>
          </TouchableOpacity>

          <View style={styles.nudgeActionRow}>
            <TouchableOpacity style={styles.nudgeCustomBtn} onPress={() => Alert.alert('Tulis sendiri', 'Fitur akan segera hadir')}>
              <Text style={styles.nudgeCustomBtnText}>✏️ Tulis sendiri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nudgeSendBtn} onPress={() => sendNudge('Semangat! Kamu pasti bisa.')}>
              <Text style={styles.nudgeSendBtnText}>Kirim 📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>AKTIVITAS TERBARU</Text>
        <View style={styles.activityContainer}>
          {activities.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#8B7355', marginTop: 10 }}>Belum ada aktivitas.</Text>
          ) : (
            activities.map(act => {
              if (act.activityType === 'message') {
                return (
                  <View key={act.id} style={styles.activityCard}>
                    <View style={styles.activityIconChat}>
                      <Text style={styles.iconEmojiSmall}>💬</Text>
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>Kamu kirim pesan: "{act.message}"</Text>
                      <Text style={styles.activityTime}>{formatActivityTime(act.createdAt)}</Text>
                    </View>
                  </View>
                );
              } else if (act.activityType === 'craving') {
                const isRelapse = act.status === 'relapsed';
                return (
                  <View key={act.id} style={styles.activityCard}>
                    <View style={isRelapse ? styles.activityIconFlash : styles.activityIconTada}>
                      <Text style={styles.iconEmojiSmall}>{isRelapse ? '⚠️' : '🎉'}</Text>
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>
                        {shortName} {isRelapse ? 'mengalami relapse (kambuh)' : 'berhasil menahan craving!'}
                      </Text>
                      <Text style={styles.activityTime}>{formatActivityTime(act.createdAt)}</Text>
                    </View>
                    <View style={isRelapse ? styles.badgeCraving : styles.badgeMilestone}>
                      <Text style={isRelapse ? styles.badgeCravingText : styles.badgeMilestoneText}>
                        {isRelapse ? 'Relapsed' : 'Survived'}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })
          )}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: '#F7F3EE' },
  centerTitle: { fontSize: 24, fontFamily: 'serif', color: '#1A1A1A', textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },
  centerSubtitle: { color: '#8B7355', textAlign: 'center', fontSize: 15, lineHeight: 22 },
  
  container: { flex: 1, backgroundColor: '#F7F3EE' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5BA86A'
  },
  badgeIcon: { fontSize: 12, marginRight: 4 },
  badgeText: { color: '#3A6147', fontSize: 12, fontWeight: '700' },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  stageTag: { backgroundColor: '#F0F7F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stageTagText: { color: '#5BA86A', fontSize: 11, fontWeight: '600' },
  progressContainer: { marginBottom: 12 },
  progressBarBg: { height: 12, backgroundColor: '#E8E2D8', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#5BA86A', borderRadius: 6 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 13, color: '#666' },
  progressSubtext: { fontSize: 13, color: '#8B7355' },

  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#8B7355', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7F2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  iconCircleYellow: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5E6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  iconCircleBlue: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6F0FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  iconCircleRed: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFEBE6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  iconEmoji: { fontSize: 18 },
  gridValue: { fontSize: 24, fontFamily: 'serif', fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  gridLabel: { fontSize: 12, color: '#8B7355' },

  nudgeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#5BA86A',
    marginBottom: 32,
  },
  nudgeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  chatIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7F2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  chatIcon: { fontSize: 18 },
  nudgeTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  nudgeSubtitle: { fontSize: 12, color: '#8B7355' },
  
  nudgeBtn: {
    backgroundColor: '#F7F3EE',
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  nudgeBtnText: { color: '#3A6147', fontSize: 13, fontWeight: '600' },
  nudgeActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  nudgeCustomBtn: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  nudgeCustomBtnText: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '700',
  },
  nudgeSendBtn: {
    flex: 1,
    backgroundColor: '#DDD3C0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  nudgeSendBtnText: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '700',
  },

  activityContainer: {
    gap: 12,
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
  },
  activityIconTada: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F7F2', alignItems: 'center', justifyContent: 'center', marginRight: 16
  },
  activityIconFlash: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF9E6', alignItems: 'center', justifyContent: 'center', marginRight: 16
  },
  activityIconChat: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#E6F0FF', alignItems: 'center', justifyContent: 'center', marginRight: 16
  },
  iconEmojiSmall: { fontSize: 16 },
  activityInfo: {
    flex: 1,
    paddingRight: 8
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#8B7355',
  },
  badgeMilestone: {
    backgroundColor: '#E6FAF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeMilestoneText: {
    color: '#3A6147',
    fontSize: 10,
    fontWeight: '600',
  },
  badgeCraving: {
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCravingText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '600',
  }
});
