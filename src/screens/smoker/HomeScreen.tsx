import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { PohonJanji, TreeStage } from '../../components/tree/PohonJanji';
import { auth, db } from '../../firebase/config';
import { doc, onSnapshot, query, collection, where, getDoc } from 'firebase/firestore';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';

const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const UserIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const CigsAvoidedIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Rect x="2" y="15" width="3.5" height="5" rx="1" fill="#5BA86A"/>
    <Rect x="7" y="11" width="3.5" height="9" rx="1" fill="#5BA86A"/>
    <Rect x="12" y="7" width="3.5" height="13" rx="1" fill="#3A6147"/>
    <Rect x="17" y="3" width="3.5" height="17" rx="1" fill="#3A6147"/>
  </Svg>
);

const MoneySavedIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#B87A10" strokeWidth="1.5"/>
    <Path d="M8 7c0 0 1-1.5 3-1.5s3.5 1.5 3.5 3c0 1.8-2 2.5-3 3v1.5" stroke="#B87A10" strokeWidth="1.5" strokeLinecap="round"/>
    <Circle cx="11" cy="17" r="1" fill="#B87A10"/>
  </Svg>
);

const CravingsAvoidedIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#2E7FBE" strokeWidth="1.5"/>
    <Path d="M7 11l3 3 5-6" stroke="#2E7FBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TimeWonBackIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#C45A6A" strokeWidth="1.5"/>
    <Path d="M11 7v4l3 2" stroke="#C45A6A" strokeWidth="1.5" strokeLinecap="round"/>
  </Svg>
);

export const HomeScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeDiff, setTimeDiff] = useState({ days: 0, hours: 0, mins: 0 });
  const [cravingsAvoided, setCravingsAvoided] = useState(0);
  const [companionName, setCompanionName] = useState('');
  const [latestMessage, setLatestMessage] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Fetch craving logs for "Cravings avoided"
    const qLogs = query(collection(db, 'cravingLogs'), where('smokerId', '==', user.uid), where('status', '==', 'survived'));
    const unsubscribeLogs = onSnapshot(qLogs, (snap) => {
        setCravingsAvoided(snap.size);
    });

    // Fetch latest support message
    const qMsgs = query(collection(db, 'supportMessages'), where('smokerId', '==', user.uid));
    const unsubscribeMsgs = onSnapshot(qMsgs, (snap) => {
      if (!snap.empty) {
        const msgs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        msgs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLatestMessage(msgs[0].message);
      } else {
        setLatestMessage('');
      }
    });

    const unsubscribeProfile = onSnapshot(doc(db, 'smokerProfiles', user.uid), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);

        // Fetch companion name
        if (data.activeCompanion && data.companionId) {
          try {
            const compDoc = await getDoc(doc(db, 'users', data.companionId));
            if (compDoc.exists()) {
              setCompanionName(compDoc.data().name || 'Companion');
            }
          } catch (e) {
            console.error(e);
          }
        } else {
          setCompanionName('');
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching smoker profile:", error);
      setLoading(false);
    });
    
    return () => {
      unsubscribeProfile();
      unsubscribeLogs();
      unsubscribeMsgs();
    };
  }, []);

  useEffect(() => {
    if (!profile?.quitStartDate) return;
    const start = new Date(profile.quitStartDate).getTime();
    
    const updateTime = () => {
      const diff = Math.max(0, new Date().getTime() - start);
      const tm = Math.floor(diff / 60000);
      setTimeDiff({
        days: Math.floor(tm / 1440),
        hours: Math.floor(tm / 60) % 24,
        mins: tm % 60
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [profile?.quitStartDate]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5BA86A" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile data not found.</Text>
      </View>
    );
  }

  const totalWater = profile?.totalWater || 0;
  
  // Growth thresholds
  const thresholds = [0, 100, 300, 1000, 2000, 3500];
  let calcStage = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalWater >= thresholds[i]) {
      calcStage = i + 1;
      break;
    }
  }
  // Use the calculated stage if it's higher than the one in the profile (fixes old bug)
  const treeStage: TreeStage = Math.max(calcStage, profile?.treeStage || 1) as TreeStage;
  
  const nextThreshold = thresholds[treeStage - 1] !== undefined && treeStage < 6 
    ? thresholds[treeStage] 
    : thresholds[thresholds.length - 1];
    
  const progressPercent = Math.min(100, (totalWater / nextThreshold) * 100);

  // Dynamic calculations
  const cigsPerDay = profile?.cigarettesPerDay || 0;
  const packPrice = profile?.packPrice || 0;
  
  const rawDays = profile?.quitStartDate 
    ? Math.max(0, new Date().getTime() - new Date(profile.quitStartDate).getTime()) / (1000 * 60 * 60 * 24)
    : 0;
    
  const cigsAvoided = Math.floor(rawDays * cigsPerDay);
  const moneySaved = Math.floor((cigsAvoided / 20) * packPrice);
  
  // 11 mins regained per cig avoided
  const timeWonMins = cigsAvoided * 11; 
  const timeWonStr = timeWonMins >= 60 
    ? `${Math.floor(timeWonMins/60)}h ${Math.floor(timeWonMins%60)}m` 
    : `${Math.floor(timeWonMins)}m`;

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount/1000000).toFixed(1)}jt`;
    if (amount >= 1000) return `Rp ${Math.floor(amount/1000)}k`;
    return `Rp ${amount}`;
  };

  const compInitials = companionName ? companionName.substring(0, 2).toUpperCase() : 'C';

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topSection}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>QuitTogether</Text>
            <TouchableOpacity style={styles.settingsBtn}>
              <SettingsIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.timerSection}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeValue}>{timeDiff.days}</Text>
              <Text style={styles.timeLabel}>Days</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeValue}>{timeDiff.hours}</Text>
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeValue}>{timeDiff.mins}</Text>
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
          </View>
          
          <Text style={styles.encouragementText}>You're doing great! 🌱</Text>
        </View>

        {/* Tree Area */}
        <View style={styles.treeArea}>
          <View style={styles.treeBackgroundSky} /> 
          <View style={styles.treeBackgroundGrass} />
          
          <View style={{ marginTop: 20 }}>
            <PohonJanji stage={treeStage} />
          </View>

          {/* Floating Bubble */}
          <View style={styles.floatingBubbleContainer}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>
                {latestMessage ? latestMessage : (profile?.activeCompanion ? "Pendampingmu sedang memperhatikanmu 🌱" : "don't you dare smoke\nor i'll be angry >:(")}
              </Text>
            </View>
            <View style={styles.bubbleArrow} />
            <View style={styles.bubbleAvatar}>
              <UserIcon />
            </View>
          </View>
        </View>

        {/* Bottom Cards */}
        <View style={styles.bottomCards}>
          <View style={styles.waterCard}>
            <View style={styles.waterTop}>
              <Text style={styles.waterTitle}>Air Pohon Janji</Text>
              <View style={styles.waterBadge}>
                <Text style={styles.waterBadgeText}>Stage {treeStage}</Text>
              </View>
            </View>
            <View style={styles.waterBarBg}>
              <View style={[styles.waterBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.waterSub}>
              <Text style={styles.waterSubText}>{totalWater} / {nextThreshold} air terkumpul</Text>
              <Text style={styles.waterSubText}>{nextThreshold - totalWater} lagi → Naik Stage</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.icGreen]}>
                <CigsAvoidedIcon />
              </View>
              <Text style={styles.statNum}>{cigsAvoided}</Text>
              <Text style={styles.statDesc}>cigarettes avoided</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.icAmber]}>
                <MoneySavedIcon />
              </View>
              <Text style={styles.statNum}>{formatMoney(moneySaved)}</Text>
              <Text style={styles.statDesc}>money saved</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.icBlue]}>
                <CravingsAvoidedIcon />
              </View>
              <Text style={styles.statNum}>{cravingsAvoided}</Text>
              <Text style={styles.statDesc}>cravings avoided</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.icRose]}>
                <TimeWonBackIcon />
              </View>
              <Text style={styles.statNum}>{timeWonStr}</Text>
              <Text style={styles.statDesc}>time won back</Text>
            </View>
          </View>

          {profile?.activeCompanion ? (
            <View>
              <Text style={styles.sectionLabel}>COMPANION</Text>
              <View style={styles.companionCard}>
                <View style={styles.compAva}>
                  <Text style={styles.compAvaText}>{compInitials}</Text>
                </View>
                <View style={styles.compInfo}>
                  <Text style={styles.compName}>{companionName || 'Menunggu data...'}</Text>
                  <Text style={styles.compSub}>Sedang memantau pohonmu</Text>
                </View>
                <View style={styles.onlineDot} />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionLabel}>COMPANION</Text>
              <View style={styles.companionCard}>
                <View style={styles.compAva}>
                  <Text style={styles.compAvaText}>?</Text>
                </View>
                <View style={styles.compInfo}>
                  <Text style={styles.compName}>Belum ada pendamping</Text>
                  <Text style={styles.compSub}>Buka tab Companion untuk undang</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F3EE'
  },
  loadingText: {
    marginTop: 12,
    color: '#1A1A1A'
  },
  errorText: {
    color: '#1A1A1A',
    fontSize: 16
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F7F3EE'
  },
  topSection: {
    backgroundColor: '#F7F3EE',
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48, // For iOS notch, roughly
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.5
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE5D9'
  },
  timerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timeLabel: {
    fontSize: 13,
    color: '#8B7355',
    marginTop: 4,
  },
  encouragementText: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 40 // Adjust if needed
  },
  treeArea: {
    position: 'relative',
    alignItems: 'center',
    height: 380,
    paddingTop: 60,
    overflow: 'hidden',
    marginTop: -32 // Overlaps with topSection curve
  },
  treeBackgroundSky: {
    position: 'absolute',
    top: 0,
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#8CB4D6',
  },
  treeBackgroundGrass: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    height: 120,
    backgroundColor: '#68A868',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300
  },
  floatingBubbleContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  bubbleText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'center'
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: 8,
    right: 48,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: '#FFF',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderBottomWidth: 0,
    transform: [{ rotate: '-45deg' }]
  },
  bubbleAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomCards: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for FAB
    gap: 12,
    backgroundColor: '#F7F3EE'
  },
  waterCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD3C0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  waterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  waterTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  waterBadge: {
    backgroundColor: '#EDF5E8',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  waterBadgeText: {
    fontSize: 11,
    color: '#3A6147',
    fontWeight: '500'
  },
  waterBarBg: {
    height: 9,
    backgroundColor: '#EDE7DC',
    borderRadius: 9,
    overflow: 'hidden',
    marginBottom: 7
  },
  waterBarFill: {
    height: '100%',
    backgroundColor: '#5BA86A',
    borderRadius: 9
  },
  waterSub: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  waterSubText: {
    fontSize: 11,
    color: '#8B7355'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD3C0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    width: '48%', // Approx half with gap
    flexDirection: 'column',
    gap: 5
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icGreen: { backgroundColor: '#EDF5E8' },
  icAmber: { backgroundColor: '#FFF8E0' },
  icBlue: { backgroundColor: '#E8F2FA' },
  icRose: { backgroundColor: '#FDECEA' },
  statNum: {
    fontFamily: 'serif',
    fontSize: 22,
    color: '#1A1A1A',
    lineHeight: 24
  },
  statDesc: {
    fontSize: 11,
    color: '#8B7355'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  companionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD3C0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  compAva: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EDF5E8',
    borderWidth: 1.5,
    borderColor: '#5BA86A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  compAvaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A6147'
  },
  compInfo: {
    flex: 1
  },
  compName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  compSub: {
    fontSize: 11,
    color: '#8B7355'
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#5BA86A'
  }
});

